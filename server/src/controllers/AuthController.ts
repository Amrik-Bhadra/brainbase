import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

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
        if (error.message === "User already exists with this email") {
            res.status(409).json({ success: false, message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

        // send refresh token as cookie
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        const { password, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
}

export const refresh = async (req: Request, res: Response) => {
    try {
        // Get token from Cookie
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({ success: false, message: "No refresh token" });
        }

        const tokens = await authService.refreshToken(refreshToken);

        // send new refresh token as cookie
        res.cookie('refreshToken', tokens.newRefreshToken, COOKIE_OPTIONS);

        res.status(200).json({
            success: true,
            accessToken: tokens.newAccessToken
        });

    } catch (error: any) {
        res.status(401).json({ success: false, message: "Invalid refresh token" });
    }
}


export const getProfile = async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "This is protected route",
        user: req.user
    });
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    // if there is a token in the cookie, remove it from DB
    if(refreshToken){
        try {
            await authService.logout(refreshToken);
        } catch (error: any) {
            console.error("Logout error:", error);
        }
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
}