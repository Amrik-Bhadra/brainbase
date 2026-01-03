import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Workspace } from "./Workspace";

@Entity()
export class Note {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column({ type: "text", nullable: true }) 
    content?: string; // "text" type for long content (Markdown)

    @Column("simple-array", { nullable: true })
    tags?: string[]

    // RELATIONSHIP: Many Notes belong to One Workspace
    @ManyToOne(() => Workspace, (workspace) => workspace.notes, { onDelete: "CASCADE" })
    @JoinColumn({ name: "workspaceId" })
    workspace: Workspace;

    @Column()
    workspaceId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}