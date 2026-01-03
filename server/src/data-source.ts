import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// // --- ADD THIS DEBUG BLOCK ---
// console.log("🔍 DEBUGGING DB CONNECTION:");
// console.log("--------------------------");
// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_PORT:", process.env.DB_PORT);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_NAME:", process.env.DB_NAME);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "******" : "UNDEFINED");
// console.log("--------------------------");
// // ----------------------------

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // TRUE for dev only (auto-creates tables). FALSE in prod.
    logging: false,
    entities: ["src/models/**/*.ts"], // We will create these next
    migrations: [],
    subscribers: [],
});