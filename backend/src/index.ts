import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Fallback to 3000 if PORT is not set in .env
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("Hello world!");
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const gracefulShutdown = () => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed gracefully.");
    // database.end(); // TODO: Implement database
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown); // Used in local development (CTRL+C)
process.on("SIGTERM", gracefulShutdown); // Used in cloud development
