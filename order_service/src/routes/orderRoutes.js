import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderDetail,
  getAllOrdersByStore,
  updateOrderStatus,
  getAllOrdersSystem,
  getDashboardSummary,
  getDashboardByStore
} from "../controllers/orderController.js";

import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import attachStore from "../middlewares/attachStore.js";

const router = express.Router();

/* USER */
router.post("/orders", verifyToken, attachStore, createOrder);
router.get("/orders/my", verifyToken, getMyOrders);
router.get("/orders/:id", verifyToken, getOrderDetail);

/* ADMIN */
router.get(
  "/admin/orders",
  verifyToken,
  isAdmin,
  attachStore,
  getAllOrdersByStore
);

router.put(
  "/admin/orders/status/:id",
  verifyToken,
  isAdmin,
  updateOrderStatus
);

router.get(
  "/admin/orders/system",
  verifyToken,
  isAdmin,
  getAllOrdersSystem
);

router.get(
  "/dashboard/summary",
  verifyToken,
  isAdmin,
  getDashboardSummary
);

router.get(
  "/dashboard/by-store",
  verifyToken,
  isAdmin,
  getDashboardByStore
);

export default router;
