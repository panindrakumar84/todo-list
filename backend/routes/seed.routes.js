import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Fetch user IDs after inserting users
    const result = await pool.query("SELECT id, username FROM users");
    const userMap = {};
    result.rows.forEach((user) => {
      userMap[user.username] = user.id;
    });

    // Insert todos
    await pool.query(
      "INSERT INTO todos (title, description, priority, user_id) VALUES ($1, $2, $3, $4)",
      [
        "Eliminate the High Table",
        "Take down every last one of them",
        "high",
        userMap["john_wick"],
      ]
    );

    await pool.query(
      "INSERT INTO todos (title, description, priority, user_id) VALUES ($1, $2, $3, $4)",
      [
        "Cook the perfect batch",
        "Blue crystal, 99.1% pure",
        "medium",
        userMap["walter_white"],
      ]
    );
    res.status(200).json({ message: "Users and todos seeded" });
  } catch (err) {
    console.error("Seeding error:", err);
    res.status(500).json({ error: "Seeding failed" });
  }
});

export default router;
