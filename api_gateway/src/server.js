import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from 'http-proxy-middleware';

import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import promotionRoutes from "./routes/promotion.routes.js";
import storeRoutes from "./routes/store.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/api/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL, // e.g., http://user_service:3001
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Service unreachable' });
  },
  timeout: 5000,
  proxyTimeout: 5000
}));

// app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/stores", storeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Gateway running" });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 API Gateway running on port ${process.env.PORT}`);
});
