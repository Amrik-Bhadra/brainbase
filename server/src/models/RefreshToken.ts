import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    token: string;

    @ManyToOne(() => User, (user) => user.refreshTokens)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    expiresAt: Date;
}