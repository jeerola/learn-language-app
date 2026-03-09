import express from "express";

import pool from "./db/pool";
import languageRouter from "./routes/languageRouter";
import wordRouter from "./routes/wordRouter";

const app = express();

// Fallback to 3000 if PORT is not set in .env
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/languages", languageRouter);
app.use("/api/words", wordRouter);

app.get("/", (req, res) => {
  res.status(200).send("Hello world!");
});

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
