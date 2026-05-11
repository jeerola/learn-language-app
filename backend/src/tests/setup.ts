import { Pool } from "pg";
import { readFileSync } from "fs";
import path from "path";
import { beforeAll, afterAll } from "vitest";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const testPool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL,
});

const sql = readFileSync(path.join(__dirname, "../db/initialize.sql"), "utf-8");

beforeAll(async () => {
  await testPool.query(sql);
});

afterAll(async () => {
  await testPool.end();
});
