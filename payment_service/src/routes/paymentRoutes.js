import express from "express";
import {
  createPayment,
  getMyPayments,
  getAllPayments,
  confirmPayment
} from "../controllers/paymentController.js";

import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* USER */
router.post("/payments", verifyToken, createPayment);
router.get("/payments/my", verifyToken, getMyPayments);

/* ADMIN */
router.get("/admin/payments", verifyToken, isAdmin, getAllPayments);
router.put(
  "/admin/payments/:id/confirm",
  verifyToken,
  isAdmin,
  confirmPayment
);

export default router;
