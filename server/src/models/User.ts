import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { RefreshToken } from "./RefreshToken";
import { Workspace } from "./Workspace";
import { WorkspaceMember } from "./WorkspaceMember";

// Define roles to control access later
export enum SystemRole {
    USER = "user",           // Standard user (Can own workspaces)
    SYSTEM_ADMIN = "admin"   // Superuser (Can delete other users, etc.)
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
        enum: SystemRole,
        default: SystemRole.USER
    })
    role: SystemRole;

    @OneToMany(() => Workspace, (workspace) => workspace.owner)
    workspaces: Workspace[]

    @OneToMany(() => RefreshToken, (token) => token.user)
    refreshTokens: RefreshToken[];

    @OneToMany(() => WorkspaceMember, (member) => member.user)
    memberships: WorkspaceMember[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}