import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

// fix __dirname cho ESM
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();

// 👉 fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

/**
 * EXPOSE THƯ MỤC UPLOAD ẢNH
 * URL: http://localhost:3002/uploads/products/xxx.jpg
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", productRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Product Service running on port ${PORT}`);
});
