import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
    try {
        const user = await authService.registerUser(req.body);

        // Security: Manually remove password from the response just to be safe
        const { password, ...userWithoutPassword } = user;

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userWithoutPassword
        })
    } catch (error: any) {
        if(error.message === "User already exists with this email"){
            res.status(409).json({ success: false, message: error.message });
        }else{
            console.error(error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}