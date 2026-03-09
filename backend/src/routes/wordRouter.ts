import { Router } from "express";
import pool from "../db/pool";

const router = Router();

// Fetches all word pairs with their actual word text and language names
// Requires JOIN with 'words' and 'languages' as 'word_pairs' only stores word ID's.
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT
            word_pairs.id,
            w1.word AS word1,
            l1.name AS language1,
            w2.word AS word2,
            l2.name AS language2
        FROM word_pairs
            JOIN words AS w1 ON word_pairs.word_id_1 = w1.id
            JOIN words AS w2 ON word_pairs.word_id_2 = w2.id
            JOIN languages AS l1 ON w1.language_id = l1.id
            JOIN languages AS l2 ON w2.language_id = l2.id`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching word pairs: ", error);
    res.status(500).json({ error: "Internal server error " });
  }
});

// Creates word pair by inserting both words separately to 'words' - table,
// then linking them together in 'word_pairs' -table.
// Uses transaction so if any step fails, all changes are reverted with ROLLBACK.
router.post("/", async (req, res) => {
  const { word1, language1_id, word2, language2_id } = req.body;

  // Take single client from pool to ensure all queries share the same connection
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert each word separately and retrieve the generated id for linking them.
    const word1Result = await client.query(
      "INSERT INTO words (word, language_id) VALUES ($1, $2) RETURNING id",
      [word1, language1_id],
    );
    const word1Id = word1Result.rows[0].id;

    const word2Result = await client.query(
      "INSERT INTO words (word, language_id) VALUES ($1, $2) RETURNING id",
      [word2, language2_id],
    );
    const word2Id = word2Result.rows[0].id;

    // Link two created words together as a translation pair.
    await client.query(
      "INSERT INTO word_pairs (word_id_1, word_id_2) VALUES ($1, $2)",
      [word1Id, word2Id],
    );

    await client.query("COMMIT");
    res.status(201).json({ message: "Word pair created successfully." });
  } catch (error) {
    // Undo all changes if any query fails to prevent orphan words with no connections in database
    await client.query("ROLLBACK");
    console.error("Error creating word pair: ", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    // Always return the client back to pool, regardless of success or failure
    client.release();
  }
});

// Deletes word pair using its ID.
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // Reject request if ID is not a positive integer
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    const result = await pool.query("DELETE FROM word_pairs WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Word pair not found." });
      return;
    }
    res.status(204).send(); // Word pair successfully deleted / 204 = No Content
  } catch (error) {
    console.error("Error deleting word pair: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
