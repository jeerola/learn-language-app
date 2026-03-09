import { Router } from "express";
import pool from "../db/pool";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM languages")
        res.json(result.rows)
    } catch (error) {
        console.error("Error fetching languages: ", error)
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
