import { AppDataSource } from "../data-source";
import { User, SystemRole } from "../models/User";
import { RefreshToken } from "../models/RefreshToken";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import { LoginUserDto } from "../dtos/LoginUser.dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);
    private refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

    async registerUser(data: CreateUserDto): Promise<User> {
        const { email, password, firstName, lastName } = data;

        // Check duplicate email
        const existingUser = await this.userRepository.findOneBy({ email });
        if (existingUser) {
            throw new Error("User already exists with this email");
        }

        // Hash Password (10 rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Instance
        const newUser = this.userRepository.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: SystemRole.USER // Default role
        });

        // Save to DB
        return await this.userRepository.save(newUser);
    }

    async loginUser(data: LoginUserDto): Promise<{ user: User, accessToken: string; refreshToken: string }> {
        const { email, password } = data;

        // find user
        const user = await this.userRepository.findOne({
            where: { email },
            select: ["id", "firstName", "lastName", "email", "role", "password"]
        });

        if (!user) {
            throw new Error("Invalid Credentials");
        }

        // compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid Credentials");
        }

        // Generate JWT Token
        const accessToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || "fallback_secret_do_not_use",
            { expiresIn: "15m" }
        );

        // Generate Refresh Token
        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "7d" }
        )

        // Save refresh token to DB
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        await this.refreshTokenRepository.save({
            token: refreshToken,
            user: user,
            expiresAt: expiryDate
        })

        return { user, accessToken, refreshToken };
    }

    async refreshToken(token: string): Promise<{ newAccessToken: string; newRefreshToken: string }> {
        // verify token signature
        let payload: any;
        try {
            payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
        } catch (error) {
            throw new Error("Invalid Refresh Token");
        }


        // check if token exists in DB (and verify owner)
        const tokenDoc = await this.refreshTokenRepository.findOne({
            where: { token },
            relations: ["user"]
        });

        if (!tokenDoc) {
            throw new Error("Invalid Refresh Token");
        }

        // Delete the old token (rotation) - one time use
        await this.refreshTokenRepository.remove(tokenDoc);

        // Generate new pair of tokens
        const newAccessToken = jwt.sign(
            { userId: tokenDoc.user.id, role: tokenDoc.user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { userId: tokenDoc.user.id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "7d" }
        );

        // save new refresh token
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        await this.refreshTokenRepository.save({
            token: newRefreshToken,
            user: tokenDoc.user,
            expiresAt: expiryDate
        });

        return { newAccessToken, newRefreshToken }
    }

    async logout(refreshToken: string): Promise<void> {
        await this.refreshTokenRepository.delete({ token: refreshToken });
    }
}