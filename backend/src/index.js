import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import { connectDB } from './lib/db.js';
import messageRoutes from './routes/message.routes.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5002;

app.use(express.json({ limit: '50mb' })); // Increased payload limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increased URL encoded data limit
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow credentials (cookies)
}));

app.use("/api/auth", authRoutes);
app.use('/api/message', messageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
    connectDB(); // Ensure DB connection is established
});
