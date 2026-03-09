import { Router } from "express";
import pool from "../db/pool";

const router = Router();

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

export default router;
