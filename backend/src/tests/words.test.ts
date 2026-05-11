import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import express from "express";
import wordRouter from "../routes/wordRouter.js";

vi.mock("../middleware/auth.js", () => ({
  checkIfAdmin: (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use("/api/words", wordRouter);

describe("GET /api/words", () => {
  it("returns all word pairs as an array", async () => {
    const response = await request(app).get("/api/words");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("POST /api/words", () => {
  const longWord = "a".repeat(101);

  it("creates word pair with valid data", async () => {
    const response = await request(app).post("/api/words").send({
      word1: "Dog",
      language1_id: 1,
      word2: "Koira",
      language2_id: 2,
    });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      word1: "Dog",
      word2: "Koira",
    });
  });

  it("rejects empty word", async () => {
    const response = await request(app).post("/api/words").send({
      word1: "",
      language1_id: 1,
      word2: "Koira",
      language2_id: 2,
    });
    expect(response.status).toBe(400);
  });

  it("rejects pairs with same language id", async () => {
    const response = await request(app).post("/api/words").send({
      word1: "Dog",
      language1_id: 1,
      word2: "Koira",
      language2_id: 1,
    });
    expect(response.status).toBe(400);
  });

  it("rejects words longer than 100 characters", async () => {
    const response = await request(app).post("/api/words").send({
      word1: longWord,
      language1_id: 1,
      word2: "Koira",
      language2_id: 2,
    });
    expect(response.status).toBe(400);
  });
});
