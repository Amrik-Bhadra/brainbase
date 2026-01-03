import express, { Application, Request, Response, NextFunction } from "express"
import helmet from "helmet"
import cors from "cors"
import dotenv from "dotenv"
import path from 'path';
import authRoutes from './routes/auth.routes';

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// load env vars
dotenv.config();

const app: Application = express();

// middleware stack
// helmet helps secure app by setting various http headers
app.use(helmet());

// CORS allows your frontend (Svelte) to talk to this backend
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

// parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use('/api/auth', authRoutes);


// Basic route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: "up", timeStamp: new Date() });
});


// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;