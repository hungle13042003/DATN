import express from "express";
import {
  getInventoryByProduct,
  createInventory,
  updateInventory,
  decreaseInventory
} from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/:productId", getInventoryByProduct);
router.post("/", createInventory);
router.put("/:productId", updateInventory);
router.put("/decrease/:productId", decreaseInventory);

export default router;
