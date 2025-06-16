import express from "express";
import { addNoteToTodo } from "../controllers/notes.controller.js";

const router = express.Router();

router.post("/:id/notes", addNoteToTodo);

export default router;
