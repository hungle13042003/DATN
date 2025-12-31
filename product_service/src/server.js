import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", productRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Product Service running on port ${PORT}`);
});
