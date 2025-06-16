import pool from "../config/db.js";

export const getTodos = async (req, res) => {
  const { user } = req.query;

  if (!user) {
    return res.status(400).json({ error: "Missing user query param" });
  }

  try {
    const userResult = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [user]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResult.rows[0].id;

    const todosResult = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(todosResult.rows);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

export const getTodoById = async (req, res) => {
  const { id } = req.params;

  try {
    // Get main todo
    const todoRes = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);
    if (todoRes.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const todo = todoRes.rows[0];

    // Get tags
    const tagsRes = await pool.query(
      `SELECT name FROM tags t
       JOIN todo_tags tt ON t.id = tt.tag_id
       WHERE tt.todo_id = $1`,
      [id]
    );
    const tags = tagsRes.rows.map((row) => row.name);

    // Get assigned users
    const usersRes = await pool.query(
      `SELECT username FROM users u
       JOIN todo_users tu ON u.id = tu.user_id
       WHERE tu.todo_id = $1`,
      [id]
    );
    const assignedUsers = usersRes.rows.map((row) => row.username);

    // Get notes
    const notesRes = await pool.query(
      "SELECT content, created_at FROM notes WHERE todo_id = $1 ORDER BY created_at DESC",
      [id]
    );

    const fullTodo = {
      ...todo,
      tags,
      assignedUsers,
      notes: notesRes.rows,
    };

    res.json(fullTodo);
  } catch (err) {
    console.error("Error fetching todo details:", err);
    res.status(500).json({ error: "Failed to fetch todo details" });
  }
};

export const createTodo = async (req, res) => {
  const {
    title,
    description,
    priority,
    tags = [],
    assignedUsers = [],
    username,
  } = req.body;

  if (!title || !username) {
    return res.status(400).json({ error: "Title and username are required" });
  }

  try {
    const userRes = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    if (userRes.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userRes.rows[0].id;

    const todoRes = await pool.query(
      `INSERT INTO todos (title, description, priority, user_id)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [title, description, priority || "medium", userId]
    );

    const todoId = todoRes.rows[0].id;

    // Handle tags
    for (const tag of tags) {
      const tagRes = await pool.query(
        `INSERT INTO tags (name)
         VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [tag]
      );
      const tagId = tagRes.rows[0].id;

      await pool.query(
        "INSERT INTO todo_tags (todo_id, tag_id) VALUES ($1, $2)",
        [todoId, tagId]
      );
    }

    // Handle mentions
    for (const username of assignedUsers) {
      const mentionRes = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
      );
      if (mentionRes.rowCount > 0) {
        const mentionedId = mentionRes.rows[0].id;
        await pool.query(
          "INSERT INTO todo_users (todo_id, user_id) VALUES ($1, $2)",
          [todoId, mentionedId]
        );
      }
    }

    res.status(201).json({ message: "Todo created", todoId });
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ error: "Failed to create todo" });
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, completed } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM todos WHERE id = $1", [
      id,
    ]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (title) {
      fields.push(`title = $${idx++}`);
      values.push(title);
    }
    if (description) {
      fields.push(`description = $${idx++}`);
      values.push(description);
    }
    if (priority) {
      fields.push(`priority = $${idx++}`);
      values.push(priority);
    }
    if (typeof completed === "boolean") {
      fields.push(`completed = $${idx++}`);
      values.push(completed);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    values.push(id);
    const query = `UPDATE todos SET ${fields.join(
      ", "
    )}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx}`;
    await pool.query(query, values);

    res.json({ message: "Todo updated" });
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: "Failed to update todo" });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
};

export const exportTodos = async (req, res) => {
  const { user } = req.query;

  if (!user) {
    return res.status(400).json({ error: "User query param is required" });
  }

  try {
    const userRes = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [user]
    );
    if (userRes.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userRes.rows[0].id;

    const todosRes = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${user}_todos.json`
    );
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(todosRes.rows, null, 2));
  } catch (err) {
    console.error("Error exporting todos:", err);
    res.status(500).json({ error: "Export failed" });
  }
};
