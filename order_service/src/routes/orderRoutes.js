import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* USER */
router.post("/orders", verifyToken, createOrder);
router.get("/orders/my", verifyToken, getMyOrders);

/* ADMIN */
router.get("/admin/orders", verifyToken, isAdmin, getAllOrders);
router.put("/admin/orders/:id", verifyToken, isAdmin, updateOrderStatus);

export default router;
