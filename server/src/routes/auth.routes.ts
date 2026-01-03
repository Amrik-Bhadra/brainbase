import { Router } from "express";
import { register } from "../controllers/AuthController";

const router = Router();

// POST http://localhost:3000/api/auth/register
router.post("/register", register);

export default router;