import express from "express";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  exportTodos,
} from "../controllers/todos.controller.js";

const router = express.Router();

router.get("/", getTodos);
router.get("/export", exportTodos);
router.get("/:id", getTodoById);
router.post("/", createTodo);
router.delete("/:id", deleteTodo);
router.put("/:id", updateTodo);

export default router;
