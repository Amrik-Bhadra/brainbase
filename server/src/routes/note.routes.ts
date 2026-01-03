import { Router } from "express";
import { createNote, getNotes } from "../controllers/NoteController";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// POST /api/notes
router.post("/", authenticate, createNote);

// GET /api/notes/:workspaceId (e.g., /api/notes/123-abc)
router.get("/:workspaceId", authenticate, getNotes);

export default router;