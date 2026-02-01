import express from "express";
import {
  addToCart,
  getCartDetail,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { attachStore } from "../middlewares/attachStore.js";

const router = express.Router();


router.post("/add", verifyToken, attachStore, addToCart);
router.get("/test", verifyToken,attachStore, getCartDetail);
router.put("/update", verifyToken, attachStore, updateCartItem);
router.delete("/remove", verifyToken,attachStore, removeCartItem);
router.post("/clear", verifyToken, attachStore, clearCart);

export default router;
