import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";

import { User } from "./User";
import { Note } from "./Notes";
import { WorkspaceMember } from "./WorkspaceMember";

@Entity()
export class Workspace {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    // Relationship: Many workshpaces belong to one owner
    @ManyToOne(() => User, (user) => user.workspaces)
    @JoinColumn({ name: "ownerId" })
    owner: User
    
    @Column()
    ownerId: string;

    @OneToMany(() => Note, (note) => note.workspace)
    notes: Note[];

    @OneToMany(() => WorkspaceMember, (member) => member.workspace)
    members: WorkspaceMember[];

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updateAt: Date;
}