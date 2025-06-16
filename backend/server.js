import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import seedRouter from "./routes/seed.routes.js";
import userRouter from "./routes/users.routes.js";
import todoRouter from "./routes/todos.routes.js";
import notesRouter from "./routes/notes.routes.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

// Test route

app.use("/api/seed", seedRouter);
app.use("/api/users", userRouter);
app.use("/api/todos", todoRouter);
app.use("/api/todos", notesRouter);

// db connection
async function initDB() {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.error("PostgreSQL connection failed:", err);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
});
