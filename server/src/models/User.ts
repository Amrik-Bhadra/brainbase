import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

// Define roles to control access later
export enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    VIEWER = "viewer"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid") // Generates unique IDs like 'a1b2-c3d4...'
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false }) // IMPORTANT: Never return the password when querying users
    password: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.VIEWER
    })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}