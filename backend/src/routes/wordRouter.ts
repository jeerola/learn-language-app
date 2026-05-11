import { Router } from "express";
import pool from "../db/pool.js";
import { checkIfAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * Fetches all word pairs with their actual word text and language names.
 * Requires JOIN with 'words' and 'languages' as 'word_pairs' only stores word ID's.
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT
            word_pairs.id,
            w1.word AS word1,
            l1.name AS language1,
            w2.word AS word2,
            l2.name AS language2,
            COALESCE(
                json_agg(
                    jsonb_build_object('id', t.id, 'name', t.name)
                ) FILTER (WHERE t.id IS NOT NULL),
                '[]'::json
            ) AS tags
        FROM word_pairs
            JOIN words AS w1 ON word_pairs.word_id_1 = w1.id
            JOIN words AS w2 ON word_pairs.word_id_2 = w2.id
            JOIN languages AS l1 ON w1.language_id = l1.id
            JOIN languages AS l2 ON w2.language_id = l2.id
            LEFT JOIN word_pair_tag AS wpt ON word_pairs.id = wpt.word_pair_id
            LEFT JOIN tags AS t ON wpt.tag_id = t.id
        GROUP BY word_pairs.id, w1.word, l1.name, w2.word, l2.name`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching word pairs: ", error);
    res.status(500).json({ error: "Internal server error " });
  }
});

/**
 * Creates word pair by inserting both words separately to 'words' - table,
 * then linking them together in 'word_pairs' -table.
 * Uses transaction so if any step fails, all changes are reverted with ROLLBACK.
 *
 * @example
 * Request body:
 *
 * {
 * "word1": "Dog",
 * "language1_id": 1,
 * "word2": "Koira",
 * "language2_id": 2
 * }
 */
router.post("/", checkIfAdmin, async (req, res) => {
  const { word1, language1_id, word2, language2_id } = req.body;

  if (!word1?.trim() || !word2?.trim()) {
    res.status(400).json({ error: "Words cannot be empty" });
    return;
  }

  if (language1_id === language2_id) {
    res.status(400).json({ error: "Both languages cannot be the same" });
    return;
  }

  if (word1.length > 100 || word2.length > 100) {
    res.status(400).json({ error: "Word cannot be over 100 characters" });
    return;
  }

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
    const idResult = await client.query(
      "INSERT INTO word_pairs (word_id_1, word_id_2) VALUES ($1, $2) RETURNING id",
      [word1Id, word2Id],
    );

    const id = idResult.rows[0].id;

    const newPairResult = await client.query(
      `
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
          JOIN languages AS l2 ON w2.language_id = l2.id
      WHERE word_pairs.id = $1`,
      [id],
    );

    await client.query("COMMIT");
    res.status(201).json(newPairResult.rows[0]);
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

/**
 * Assigns a tag to a word pair.
 *
 * @example
 * Request body:
 *
 * {
 * "tagId": 1
 * }
 */
router.post("/:id/tags", checkIfAdmin, async (req, res) => {
  const wordPairId = parseInt(req.params.id as string);
  const tagId = Number(req.body.tagId);

  if (isNaN(wordPairId) || wordPairId <= 0) {
    res.status(400).json({ error: "Invalid word pair ID" });
    return;
  }

  if (isNaN(tagId) || tagId <= 0) {
    res.status(400).json({ error: "Invalid tag ID" });
    return;
  }

  try {
    await pool.query(
      `INSERT INTO word_pair_tag (word_pair_id, tag_id)
       VALUES ($1, $2)
       ON CONFLICT (word_pair_id, tag_id) DO NOTHING`,
      [wordPairId, tagId],
    );
    res.status(201).send();
  } catch (error) {
    if ((error as any).code === "23503") {
      // Postgre error code for foreign key violation
      res.status(404).json({ error: "Id not found" });
    } else {
      console.error("Error assigning tag to word pair: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

/**
 * Deletes word pair using its ID.
 */
router.delete("/:id", checkIfAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);

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

/**
 * Updates word text for both words in a pair.
 * Uses transaction to ensure both words are updated together or not at all.
 *
 * @example
 * Request body:
 * {
 * "word1": "Cat",
 * "word2": "Kissa"
 * }
 */
router.put("/:id", checkIfAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);

  // Reject request if ID is not a positive integer
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  // Take single client from pool to ensure all queries share the same connection
  const client = await pool.connect();

  const { word1, word2 } = req.body;

  try {
    await client.query("BEGIN");
    const result = await client.query(
      "SELECT word_id_1, word_id_2 FROM word_pairs WHERE id = $1",
      [id],
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({ error: "Word pair not found." });
      return;
    }

    const word_id_1 = result.rows[0].word_id_1;
    const word_id_2 = result.rows[0].word_id_2;

    await client.query("UPDATE words SET word = $1 WHERE id = $2", [
      word1,
      word_id_1,
    ]);

    await client.query("UPDATE words SET word = $1 WHERE id = $2", [
      word2,
      word_id_2,
    ]);

    const updatedPairResult = await client.query(
      `
              SELECT
            word_pairs.id,
            w1.word AS word1,
            l1.name AS language1,
            w2.word AS word2,
            l2.name AS language2,
            COALESCE(
                json_agg(
                    jsonb_build_object('id', t.id, 'name', t.name)
                ) FILTER (WHERE t.id IS NOT NULL),
                '[]'::json
            ) AS tags
        FROM word_pairs
            JOIN words AS w1 ON word_pairs.word_id_1 = w1.id
            JOIN words AS w2 ON word_pairs.word_id_2 = w2.id
            JOIN languages AS l1 ON w1.language_id = l1.id
            JOIN languages AS l2 ON w2.language_id = l2.id
            LEFT JOIN word_pair_tag AS wpt ON word_pairs.id = wpt.word_pair_id
            LEFT JOIN tags AS t ON wpt.tag_id = t.id
            WHERE word_pairs.id = $1
        GROUP BY word_pairs.id, w1.word, l1.name, w2.word, l2.name`,
      [id],
    );

    await client.query("COMMIT");
    res.status(200).json(updatedPairResult.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating word pair: ", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    // Always return the client back to pool, regardless of success or failure
    client.release();
  }
});

/**
 * Updates tag in a word pair.
 * Tag can be created, deleted or updated to other tag.
 */
router.put("/:id/tags", checkIfAdmin, async (req, res) => {
  const tagId = req.body.tagId;
  const wordPairId = parseInt(req.params.id as string);

  if (isNaN(wordPairId) || wordPairId <= 0) {
    res.status(400).json({ error: "Invalid word pair ID" });
    return;
  }

  if (isNaN(tagId) || tagId < 0) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    if (tagId === 0 || tagId === null) {
      await pool.query(`DELETE from word_pair_tag WHERE word_pair_id = $1`, [
        wordPairId,
      ]);
      res.status(200).send();
    } else {
      await pool.query(`DELETE FROM word_pair_tag WHERE word_pair_id = $1`, [
        wordPairId,
      ]);
      await pool.query(
        `INSERT INTO word_pair_tag (word_pair_id, tag_id)
       VALUES ($1, $2)`,
        [wordPairId, tagId],
      );
      res.status(200).send();
    }
  } catch (error) {
    console.error("Error updating tags:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
