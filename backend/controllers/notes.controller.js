import pool from "../config/db.js";

export const addNoteToTodo = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Note content is required" });
  }

  try {
    const todoCheck = await pool.query("SELECT id FROM todos WHERE id = $1", [
      id,
    ]);
    if (todoCheck.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await pool.query("INSERT INTO notes (content, todo_id) VALUES ($1, $2)", [
      content,
      id,
    ]);

    res.status(201).json({ message: "Note added" });
  } catch (err) {
    console.error("Error adding note:", err);
    res.status(500).json({ error: "Failed to add note" });
  }
};
