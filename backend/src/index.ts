import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import dotenv from "dotenv";

import pool from "./db/pool.js";
import languageRouter from "./routes/languageRouter.js";
import wordRouter from "./routes/wordRouter.js";
import tagRouter from "./routes/tagRouter.js";
import authRouter from "./routes/authRouter.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Fallback to 3000 if PORT is not set in .env
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SECRET;

if (!sessionSecret) {
  throw new Error("SECRET environment variable is required");
}

app.use(express.json());
app.use(
  session({
    secret: sessionSecret,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  }),
);

app.use("/api/languages", languageRouter);
app.use("/api/words", wordRouter);
app.use("/api/tags", tagRouter);
app.use("/api/auth", authRouter);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

/**
 * Starts express server, and verifies database connection with simple time query.
 */
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  pool
    .query("SELECT NOW()") // test database connection
    .then(() => console.log("Database connected successfully"))
    .catch((err) => {
      console.error("Database connection failed:", err);
      process.exit(1);
    });
});

/**
 * Executes graceful shutdown, closing server and pool.
 *
 * Ensures active connections are closed cleanly before exiting, preventing data loss
 * or lingering connections.
 */
const gracefulShutdown = () => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed gracefully.");
    pool.end();
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown); // Used in local development (CTRL+C)
process.on("SIGTERM", gracefulShutdown); // Used in cloud development
