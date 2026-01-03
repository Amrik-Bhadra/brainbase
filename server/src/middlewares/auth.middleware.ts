import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/User";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // Get the token from Header
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });
    }

    // token = "Bearer jbkjbfurw.."
    // split = ["Bearer", "jbkjbfurw.."]
    // take index 1 (token)
    const token = authHeader.split(" ")[1];

    try {
        // verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "fallback_secret_do_not_use"
        ) as { userId: string; role: UserRole };

        // Attach to Request
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        next();

    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
}