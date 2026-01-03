import { AppDataSource } from "../data-source";
import { User, UserRole } from "../models/User";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import { LoginUserDto } from "../dtos/LoginUser.dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

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
            role:UserRole.VIEWER // Default role
        });

        // Save to DB
        return await this.userRepository.save(newUser);
    }

    async loginUser(data: LoginUserDto): Promise<{ user: User, token: string }> {
        const { email, password } = data;

        // find user
        const user = await this.userRepository.findOne({
            where: { email },
            select: ["id", "firstName", "lastName", "email", "role", "password"]
        });

        if(!user){
            throw new Error("Invalid Credentials");
        }

        // compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new Error("Invalid Credentials");
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || "fallback_secret_do_not_use",
            { expiresIn: "1h" }
        );

        return { user, token };
    }
}