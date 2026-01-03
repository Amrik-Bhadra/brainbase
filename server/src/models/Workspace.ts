import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

import { User } from "./User";

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

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updateAt: Date;
}