import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", orderRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`🚀 Order Service running on port ${PORT}`);
});
