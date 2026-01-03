import { Router } from "express";
import { register, login, getProfile } from "../controllers/AuthController";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { registerValidators, loginValidators } from "../dtos/auth.validators";

const router = Router();

// POST http://localhost:3000/api/auth/register
router.post("/register", validate(registerValidators), register);

// POST http://localhost:3000/api/auth/login
router.post("/login", validate(loginValidators), login)

// GET http://localhost:3000/api/auth/me
router.get("/me", authenticate, getProfile);

export default router;