import app from "./app";
import { AppDataSource } from "./data-source";

const PORT = process.env.PORT || 3000;

// Connect to DB first
AppDataSource.initialize()
.then(() => {
    console.log("✅ Data Source has been initialized!");

    // Start Server only if DB is connected
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
})
.catch((err: any) => {
    console.error("❌ Error during Data Source initialization", err);
});
