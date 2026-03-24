import path from "path";
import { readFileSync } from "fs";

import pool from "./pool.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const sqlPath = path.join(__dirname, "languageData.sql");

const sql = readFileSync(sqlPath, "utf-8");

// Inserts the database with default languages required for the app to function.
// Uses SQL file to keep data separate from logic.
const insertData = async () => {
    try {
        await pool.query(sql);
        console.log("Default languages added successfully.");
    } catch (error) {
        console.error("Error adding default languages to database: ", error);
    } finally {
        pool.end();
    }
}

insertData();
