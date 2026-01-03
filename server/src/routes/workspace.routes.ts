import { Router } from "express";
import { createWorkspace, getWorkspaces, inviteUser } from "../controllers/WorkspaceController";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { body } from "express-validator";

const router = Router();

/// Validation rule
const createValidators = [
    body('name').trim().notEmpty().withMessage('Workspace name is required')
];

// POST /api/workspaces (Protected)
router.post("/", authenticate, validate(createValidators), createWorkspace);

// GET /api/workspaces (Protected)
router.get("/", authenticate, getWorkspaces);

// POST /api/workspaces/:workspaceId/members
router.post("/:workspaceId/members", authenticate, inviteUser);

export default router;