import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Workspace } from "./Workspace";

export enum WorkspaceRole {
    ADMIN = "admin",   // Can delete workspace, manage members, edit notes
    EDITOR = "editor", // Can create/edit notes
    VIEWER = "viewer"  // Read-only
}

@Entity()
export class WorkspaceMember {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Workspace, (workspace) => workspace.members, { onDelete: "CASCADE" })
    @JoinColumn({ name: "workspaceId" })
    workspace: Workspace;

    @Column()
    workspaceId: string;

    @ManyToOne(() => User, (user) => user.memberships, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @Column()
    userId: string;

    @Column({
        type: "enum",
        enum: WorkspaceRole,
        default: WorkspaceRole.VIEWER
    })
    role: WorkspaceRole;

    @CreateDateColumn()
    joinedAt: Date;
}