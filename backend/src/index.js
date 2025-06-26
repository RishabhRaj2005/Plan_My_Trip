import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import path from "path";
import { connectDB } from './lib/database.js';
import authRoutes from './routes/auth.route.js';
import itineraryRoutes from './routes/itinerary.route.js'

dotenv.config();
const PORT = process.env.PORT||5000;
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin:  ["http://localhost:5173", "https://guileless-rolypoly-f838a7.netlify.app"],
        credentials: true,
    })
)



app.use("/api/auth", authRoutes);
app.use("/api/itinerary", itineraryRoutes);

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
