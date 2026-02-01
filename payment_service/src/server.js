import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
//import paymentRoutes from "./routes/paymentRoutes.js";
import vnpayRoutes from "./routes/vnpayRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

//app.use("/api", paymentRoutes);
app.use("/api", vnpayRoutes);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`🚀 Payment Service running on port ${PORT}`);
});
