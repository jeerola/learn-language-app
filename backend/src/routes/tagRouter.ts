import { Router } from "express";
import pool from "../db/pool";

const router = Router();

/**
 * Fetches all tags from database.
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tags");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tags: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Creates a new tag to database based on admins input
 *
 * @example
 * Request body:
 *
 * {
 * "name": "Animals"
 * }
 */
router.post("/", async (req, res) => {
    const tagName = req.body.name;

    try {
      const result = await pool.query(
        `INSERT INTO tags (name) VALUES ($1) RETURNING id, name`,
        [tagName],
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating tag: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
})

/**
 * Deletes a tag from database
 */
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // Reject request if ID is not a positive integer
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    const result = await pool.query("DELETE FROM tags WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Tag not found." });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting a tag: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
