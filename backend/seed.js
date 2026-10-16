import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { run, get, close } from "./db.js";

dotenv.config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password123";

async function ensureSchema() {
  await run(`
CREATE TABLE IF NOT EXISTS participants (
  _id SERIAL PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "dob" TEXT NOT NULL,
  "gender" TEXT NOT NULL,
  "phone" TEXT NOT NULL UNIQUE,
  "email" TEXT NOT NULL UNIQUE,
  "emergencyContact" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "pincode" TEXT NOT NULL,
  "size" TEXT NOT NULL,
  "cityId" TEXT NOT NULL,
  "raceId" TEXT NOT NULL,
  "paymentStatus" TEXT NOT NULL DEFAULT 'Pending',
  "paymentTxnId" TEXT DEFAULT '',
  "bibNumber" TEXT DEFAULT '',
  "salesforceLeadId" TEXT DEFAULT '',
  "zohoLeadId" TEXT DEFAULT '',
  "registrationDate" TEXT NOT NULL DEFAULT NOW(),
  "finishTime" TEXT DEFAULT '',
  "raceStatus" TEXT NOT NULL DEFAULT 'Pending',
  "sentSeven" INTEGER NOT NULL DEFAULT 0,
  "sentThree" INTEGER NOT NULL DEFAULT 0,
  "sentTwentyFour" INTEGER NOT NULL DEFAULT 0,
  "sentThankYou" INTEGER NOT NULL DEFAULT 0,
  "sentCertificate" INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS contact_messages (
  _id SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "date" TEXT NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS admins (
  _id SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL
);
`);
}

async function seed() {
  try {
    await ensureSchema();
    console.log("Connected to PostgreSQL database for seeding.");

    const existingAdmin = await get(`SELECT * FROM admins WHERE "username" = ?`, [ADMIN_USERNAME]);
    if (existingAdmin) {
      console.log(`Admin user '${ADMIN_USERNAME}' already exists. Updating password...`);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await run(`UPDATE admins SET "password" = ? WHERE "username" = ?`, [hashedPassword, ADMIN_USERNAME]);
      console.log("Admin password updated successfully.");
    } else {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await run(`INSERT INTO admins ("username", "password") VALUES (?, ?)`, [ADMIN_USERNAME, hashedPassword]);
      console.log(`Admin user '${ADMIN_USERNAME}' created successfully.`);
    }
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await close();
    console.log("Database connection closed.");
  }
}

seed();
