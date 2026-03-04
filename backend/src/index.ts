import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Fallback to 3000 if PORT is not set in .env
const port = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.status(200).send("Hello world!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
