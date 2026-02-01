import express from "express";
import {
  initInventory,
  getInventoryByProduct,
  getInventoryByStore,
  decreaseInventory,
  increaseInventory,
  getInventorySummary,
  updateInventoryByAdmin
} from "../controllers/inventoryController.js";

import { attachStore } from "../middlewares/attachStore.js";

const router = express.Router();

// ❌ không cần store context
router.post("/init", initInventory);
router.get("/product/:productId", getInventoryByProduct);
router.get("/store/:storeId", getInventoryByStore);

// ✅ BẮT BUỘC store context
router.post("/decrease", attachStore, decreaseInventory);
router.post("/increase", attachStore, increaseInventory);


router.get("/summary", getInventorySummary);
// Admin chỉnh tồn kho
router.put("/admin/update", updateInventoryByAdmin);
export default router;
