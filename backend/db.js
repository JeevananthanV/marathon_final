import fs from "fs";

function toPgSql(sql) {
  let idx = 1;
  return sql.replace(/\?/g, () => `$${idx++}`);
}

// True when the SQL text contains more than one statement (e.g. schema DDL blocks).
function isMultiStatement(sql) {
  return (sql.match(/;/g) || []).filter((c) => c === ";").length > 1;
}

/**
 * Database layer for Run Beyond Limits 2026.
 *
 * Backends:
 *   - PGlite (embedded PostgreSQL, WASM)  -> used when no reachable server
 *   - node-postgres `pg` Pool             -> used when DATABASE_URL is reachable
 *
 * Both expose the same surface: run(sql, params) -> { rows }
 * SQL is written with `?` placeholders and converted to PostgreSQL `$n`.
 */

const PGLITE_DIR = process.env.PGLITE_DIR || "./pglite-data";

let backend = null; // "pglite" | "pg"
let ready = null; // Promise resolved once a backend is initialised

async function tryPgPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  try {
    const { Pool } = await import("pg");
    const pool = new Pool({
      connectionString,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: Number(process.env.DATABASE_CONNECT_TIMEOUT_MS || 3000),
    });

    // Force a real connection test before committing to this backend.
    await pool.query("SELECT 1");
    return pool;
  } catch (err) {
    console.warn(
      `[db] No PostgreSQL server reachable at DATABASE_URL (${err.message}). Falling back to embedded PGlite.`
    );
    return null;
  }
}

async function init() {
  if (backend) return backend;

  const pool = await tryPgPool();
  if (pool) {
    backend = {
      name: "pg",
      query: async (sql, params) => {
        const res = await pool.query(sql, params);
        return { rows: res.rows, rowCount: res.rowCount };
      },
      close: async () => {
        await pool.end();
      },
    };
    console.log(`[db] Connected to PostgreSQL server at ${process.env.DATABASE_URL}`);
    return backend;
  }

  const { PGlite } = await import("@electric-sql/pglite");
  if (!fs.existsSync(PGLITE_DIR)) fs.mkdirSync(PGLITE_DIR, { recursive: true });

  const pidFile = `${PGLITE_DIR}/postmaster.pid`;
  if (fs.existsSync(pidFile)) {
    try {
      fs.unlinkSync(pidFile);
      console.log("[db] Removed stale postmaster.pid lock file");
    } catch (_) {}
  }

  let pg;
  try {
    pg = new PGlite(PGLITE_DIR);
    await pg.waitReady;
  } catch (err) {
    console.warn(`[db] PGlite failed to load from ${PGLITE_DIR}. Attempting recovery...`);
    try {
      const backupDir = `${PGLITE_DIR}_corrupted_${Date.now()}`;
      if (fs.existsSync(PGLITE_DIR)) {
        fs.renameSync(PGLITE_DIR, backupDir);
      }
      pg = new PGlite(PGLITE_DIR);
      await pg.waitReady;
      console.log(`[db] PGlite successfully re-initialized fresh data directory: ${PGLITE_DIR}`);
    } catch (fallbackErr) {
      console.warn(`[db] Disk PGlite failed (${fallbackErr.message}). Falling back to memory database.`);
      pg = new PGlite();
      await pg.waitReady;
    }
  }

  backend = {
    name: "pglite",
    query: async (sql, params) => {
      // Parameterised path: single statement with bind params.
      if (params && params.length > 0) {
        const res = await pg.query(sql, params);
        return { rows: res.rows || [], rowCount: res.affectedRows ?? (res.rows || []).length };
      }

      // No params: may contain multiple statements (schema DDL), so use exec().
      if (isMultiStatement(sql)) {
        await pg.exec(sql);
        return { rows: [], rowCount: 0 };
      }

      const res = await pg.query(sql);
      return { rows: res.rows || [], rowCount: res.affectedRows ?? (res.rows || []).length };
    },
    close: async () => {
      await pg.close();
    },
  };
  console.log(`[db] Using embedded PGlite (PostgreSQL/WASM) data dir: ${PGLITE_DIR}`);
  return backend;
}

function getBackend() {
  if (!ready) {
    ready = init().catch((err) => {
      ready = null;
      throw err;
    });
  }
  return ready;
}

async function run(sql, params = []) {
  const db = await getBackend();
  return db.query(toPgSql(sql), params);
}

async function get(sql, params = []) {
  const { rows } = await run(sql, params);
  return rows[0] || null;
}

async function all(sql, params = []) {
  const { rows } = await run(sql, params);
  return rows;
}

async function close() {
  if (!ready) return;
  const db = await ready;
  await db.close();
  backend = null;
  ready = null;
}

export { run, get, all, close, getBackend, toPgSql };