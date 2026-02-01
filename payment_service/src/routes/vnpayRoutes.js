import express from "express";
import { createPayment } from "../controllers/vnpayController.js";

const router = express.Router();

router.post("/create", createPayment);

export default router;
