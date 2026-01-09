import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getDashboardOverview,
  getRevenueByMonth,
  getOrdersByMonth,
} from "../controllers/orderController.js";

import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* USER */
router.post("/orders", verifyToken, createOrder);
router.get("/orders/my", verifyToken, getMyOrders);

/* ADMIN */
router.get("/admin/orders", verifyToken, isAdmin, getAllOrders);
router.put("/admin/orders/:id", verifyToken, isAdmin, updateOrderStatus);


router.get("/admin/statistics/overview", verifyToken, isAdmin, getDashboardOverview);
router.get("/admin/statistics/revenue-month", verifyToken, isAdmin, getRevenueByMonth);
router.get("/admin/statistics/orders-month", verifyToken, isAdmin, getOrdersByMonth);
export default router;
