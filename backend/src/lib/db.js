import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({});

const DB_NAME = "Chat_Application"
export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("DataBase Connected");

    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
}
