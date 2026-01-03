import { AppDataSource } from "../data-source";
import { User, UserRole } from "../models/User";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import bcrypt from "bcryptjs";

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
}