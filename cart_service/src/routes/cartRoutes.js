import express from "express";
import {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart,
  getCartDetail
} from "../controllers/cartController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();


// User phải login mới dùng giỏ hàng
router.get("/", authMiddleware, getCart);
router.post("/", authMiddleware, addToCart);
router.put("/", authMiddleware, updateQuantity);
router.delete("/:productId", authMiddleware, removeItem);
router.delete("/clear", authMiddleware, clearCart);
router.get("/test", authMiddleware, getCartDetail);

export default router;
