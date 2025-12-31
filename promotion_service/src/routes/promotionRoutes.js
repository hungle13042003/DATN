import express from "express";
import {
  createPromotion,
  getAllPromotions,
  getPromotionByCode,
  updatePromotion,
  deletePromotion,
  applyPromotion,
} from "../controllers/promotionController.js";

const router = express.Router();

router.post("/", createPromotion);
router.get("/", getAllPromotions);
router.get("/:code", getPromotionByCode);
router.put("/:id", updatePromotion);
router.delete("/:id", deletePromotion);

router.post("/apply/voucher", applyPromotion);

export default router;
