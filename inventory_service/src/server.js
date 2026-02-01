import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import cors from "cors";
dotenv.config();



const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/inventory", inventoryRoutes);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Inventory Service running on port ${PORT}`);
});
