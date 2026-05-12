import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import express from "express";
import tagRouter from "../routes/tagRouter.js";

vi.mock("../middleware/auth.js", () => ({
  checkIfAdmin: (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use("/api/tags", tagRouter);

describe("GET /api/tags", () => {
  it("returns all tags as an array", async () => {
    const response = await request(app).get("/api/tags");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("POST /api/tags", () => {
  const maxTagName = "a".repeat(50);
  const longName = "a".repeat(51);

  it("creates new tag with valid data", async () => {
    const response = await request(app).post("/api/tags").send({
      name: "Animals",
    });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "Animals",
    });
  });

  it("rejects new tag with empty name", async () => {
    const response = await request(app).post("/api/tags").send({
      name: "",
    });
    expect(response.status).toBe(400);
  });

  it("rejects tags longer than 50 characters", async () => {
    const response = await request(app).post("/api/tags").send({
      name: longName,
    });
    expect(response.status).toBe(400);
  });

  it("creates tag that is 50 characters long", async () => {
    const response = await request(app).post("/api/tags").send({
      name: maxTagName,
    });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: maxTagName,
    });
  });
});

describe("DELETE /api/tags/:id", () => {
  it("deletes existing tag", async () => {
    const createResponse = await request(app).post("/api/tags").send({
      name: "Animals",
    });
    expect(createResponse.status).toBe(201);

    const id = createResponse.body.id;

    const deleteResponse = await request(app).delete(`/api/tags/${id}`);
    expect(deleteResponse.status).toBe(204);
  });

  it("rejects deleting tag with nonexisting id", async () => {
    const deleteResponse = await request(app).delete("/api/tags/99999");
    expect(deleteResponse.status).toBe(404);
  });

  it("rejects deleting tag with invalid id", async () => {
    const deleteResponse = await request(app).delete("/api/tags/0");
    expect(deleteResponse.status).toBe(400);
  });
});
