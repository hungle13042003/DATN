import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log(`Cart Service running on port ${PORT}`));
