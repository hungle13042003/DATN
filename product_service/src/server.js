import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

// 👉 BẮT BUỘC CHO __dirname (ESM)
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();

// 👉 fix __dirname cho ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// 👉 expose đúng thư mục src/uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", productRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Product Service running on port ${PORT}`);
});
