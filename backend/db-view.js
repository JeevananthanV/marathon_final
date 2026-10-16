/**
 * Inspect the PostgreSQL database.
 *
 * Usage:
 *   node db-view.js                    # summary: tables + row counts
 *   node db-view.js participants 10    # first 10 rows of a table
 *   node db-view.js admins
 *   node db-view.js contact_messages
 *   node db-view.js paid               # preset report: paid by city/race
 *   node db-view.js bibs               # preset: BIB assignments
 *   node db-view.js cities             # preset: totals per city
 *   node db-view.js file query.sql     # run SQL from a file (avoids shell quoting)
 *   node db-view.js "SELECT ..." 20    # inline SQL
 *
 * PowerShell strips inner double quotes before passing args to native binaries,
 * so `"cityId"` can arrive as `cityId` (and then PostgreSQL lowercases it).
 * For queries with quoted identifiers prefer:  node db-view.js file query.sql
 */
import fs from "fs";
import dotenv from "dotenv";
import { all, close } from "./db.js";

dotenv.config();

const TABLES = ["participants", "contact_messages", "admins"];

const PRESETS = {
  paid: `SELECT "cityId", "raceId", count(*)::int AS paid, count(*) FILTER (WHERE "bibNumber" <> '')::int AS with_bib
           FROM participants WHERE "paymentStatus" = 'Paid' GROUP BY 1,2 ORDER BY 1,2`,
  pending: `SELECT "cityId", "raceId", count(*)::int AS pending
              FROM participants WHERE "paymentStatus" = 'Pending' GROUP BY 1,2 ORDER BY 1,2`,
  bibs: `SELECT "bibNumber", "fullName", "cityId", "raceId", "paymentStatus"
           FROM participants WHERE "bibNumber" <> '' ORDER BY "bibNumber"`,
  cities: `SELECT "cityId", count(*)::int AS total, count(*) FILTER (WHERE "paymentStatus"='Paid')::int AS paid
             FROM participants GROUP BY 1 ORDER BY 1`,
  recent: `SELECT _id, "fullName", "email", "cityId", "raceId", "paymentStatus", "registrationDate"
             FROM participants ORDER BY _id DESC`,
};

function isSelect(sql) {
  return /^\s*(select|with)\b/i.test(sql);
}

function formatTable(rows) {
  const cols = Object.keys(rows[0]);
  const widths = cols.map((c) => Math.max(c.length, ...rows.map((r) => String(r[c] ?? "").length)));
  const line = (vals) => vals.map((v, i) => String(v ?? "").padEnd(widths[i])).join("  ");
  const sep = widths.map((w) => "-".repeat(w)).join("  ");
  return [line(cols), sep, ...rows.map((r) => line(cols.map((c) => r[c])))].join("\n");
}

async function show(sql, limit) {
  const rows = await all(`${sql} LIMIT ${limit}`);
  if (!rows.length) {
    console.log("(no rows)");
    return;
  }
  console.log(`${rows.length} row(s):\n`);
  console.log(formatTable(rows));
}

async function main() {
  const [arg1, arg2] = process.argv.slice(2);

  // Summary
  if (!arg1) {
    const tables = await all(
      `SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' ORDER BY table_name`
    );
    console.log("Tables in database:\n");
    for (const t of tables) {
      const [c] = await all(`SELECT count(*)::int AS c FROM "${t.table_name}"`);
      const [cols] = await all(
        `SELECT count(*)::int AS c FROM information_schema.columns
          WHERE table_name = '${t.table_name}'`
      );
      console.log(`  ${t.table_name.padEnd(20)} rows=${String(c.c).padEnd(6)} columns=${cols.c}`);
    }

    const breakdown = await all(PRESETS.cities);
    if (breakdown.length) {
      console.log("\nParticipants per city:");
      for (const r of breakdown) {
        console.log(`  ${String(r.cityId).padEnd(12)} total=${String(r.total).padEnd(5)} paid=${r.paid}`);
      }
    }
    return;
  }

  // Preset report
  if (PRESETS[arg1]) {
    console.log(`\n${arg1.toUpperCase()}\n`);
    await show(PRESETS[arg1], Number(arg2) || 50);
    return;
  }

  // SQL from a file (avoids PowerShell quote mangling)
  if (arg1 === "file") {
    if (!arg2) {
      console.error("Provide a file path: node db-view.js file query.sql");
      process.exitCode = 1;
      return;
    }
    let sql;
    try {
      sql = fs.readFileSync(arg2, "utf8").trim().replace(/;\s*$/, "");
    } catch (e) {
      console.error(`Cannot read file: ${e.message}`);
      process.exitCode = 1;
      return;
    }
    if (!isSelect(sql)) {
      console.error("Only read-only SELECT/WITH queries are allowed here.");
      process.exitCode = 1;
      return;
    }
    console.log(`\n${arg2}\n`);
    await show(sql, 200);
    return;
  }

  // Table name
  if (TABLES.includes(arg1)) {
    console.log(`\n${arg1}\n`);
    await show(`SELECT * FROM "${arg1}"`, Number(arg2) || 20);
    return;
  }

  // Inline SQL
  if (isSelect(arg1)) {
    console.log();
    await show(arg1.replace(/;\s*$/, ""), Number(arg2) || 20);
    return;
  }

  console.error(`Unknown argument: ${arg1}`);
  console.error("\nTry one of:");
  console.error("  node db-view.js");
  console.error("  node db-view.js participants 10");
  console.error(`  node db-view.js ${Object.keys(PRESETS).join(" | ")}`);
  console.error("  node db-view.js file query.sql");
  process.exitCode = 1;
}

main()
  .catch((err) => {
    console.error("Error:", err.message);
    process.exitCode = 1;
  })
  .finally(() => close());