import { Router } from "express";
import pool from "../db/pool.js";
import bcrypt from "bcrypt";

const router = Router();

/**
 * Logs user in to the application.
 */
router.post("/login", async (req, res) => {
  try {
    const {
      body: { username, password },
    } = req;

    const result = await pool.query(
      `SELECT id, username, password_hash, role FROM users WHERE username = $1`,
      [username],
    );

    if (!result.rows[0]) {
      res.status(401).json({ error: "Invalid user credentials." });
      return;
    }
    const passToCompare = result.rows[0].password_hash;

    if (await bcrypt.compare(password, passToCompare)) {
      const user = {
        id: result.rows[0].id,
        username: result.rows[0].username,
        role: result.rows[0].role,
      };
      (req.session as any).user = user;
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: "Invalid user credentials." });
    }
  } catch (error) {
    console.error("Error fetching user: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Logs user out from application.
 */
router.post("/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error logging user out: ", err);
        res.status(500).json({message: "Internal server error"})
        return;
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
});

export default router;
