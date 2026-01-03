import { Router } from "express";
import { register, login, getProfile } from "../controllers/AuthController";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// POST http://localhost:3000/api/auth/register
router.post("/register", register);

// POST http://localhost:3000/api/auth/login
router.post("/login", login)

// GET http://localhost:3000/api/auth/me
router.get("/me", authenticate, getProfile);

export default router;