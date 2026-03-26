import path from "path";
import { readFileSync } from "fs";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import pool from "./pool.js";

dotenv.config();

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const sqlPath = path.join(__dirname, "languageData.sql");

const sql = readFileSync(sqlPath, "utf-8");

/**
 * Inserts the database with default languages required for the app to function.
 * Uses SQL file to keep data separate from logic.
 */
const insertData = async () => {
  try {
    await pool.query(sql);
    console.log("Default languages added successfully.");
  } catch (error) {
    console.error("Error adding default languages to database: ", error);
  }
};

/**
 * Inserts one sample user to application with admin priviledges.
 */
const seedUsers = async () => {
  if (!process.env.SEEDUSERPW) {
    throw new Error("Seed user password not found!");
  }

  try {
    const password = process.env.SEEDUSERPW;

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `
  INSERT INTO users (username, password_hash, role) VALUES
    ('admin', $1, 'admin')
    ON CONFLICT (username) DO NOTHING`,
      [hash],
    );
    console.log("Default admin added successfully");
  } catch (error) {
    console.error("Error adding default admin to database: ", error);
  }
};

await insertData();
await seedUsers();
pool.end();
