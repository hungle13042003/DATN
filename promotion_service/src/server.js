import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import promotionRoutes from "./routes/promotionRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/promotions", promotionRoutes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`🚀 Promotion Service running on port ${PORT}`);
});
