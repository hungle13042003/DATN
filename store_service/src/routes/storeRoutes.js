import express from "express";
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deactivateStore
} from "../controllers/storeController.js";

import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ===== PUBLIC ===== */
router.get("/stores", getAllStores);
router.get("/stores/:id", getStoreById);

/* ===== ADMIN ===== */
router.post("/admin/stores", verifyToken, isAdmin, createStore);
router.put("/admin/stores/:id", verifyToken, isAdmin, updateStore);
router.delete("/admin/stores/:id", verifyToken, isAdmin, deactivateStore);

export default router;
