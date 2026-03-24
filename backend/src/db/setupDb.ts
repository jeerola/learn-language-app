import path from "path";
import { readFileSync } from "fs";

import pool from "./pool.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const sqlPath = path.join(__dirname, "initialize.sql");

const sql = readFileSync(sqlPath, "utf-8");

pool
  .query(sql)
  .then(() => console.log("Database initialized successfully."))
  .catch((err) => console.error("Error creating database: ", err))
  .finally(() => pool.end());
