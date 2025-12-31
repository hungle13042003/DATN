import express from "express";
import axios from "axios";

const router = express.Router();
const SERVICE_URL = process.env.PAYMENT_SERVICE_URL;

router.use(async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: SERVICE_URL + req.originalUrl.replace("/api/payments", ""),
      headers: req.headers,
      data: req.body
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { message: "Payment service error" }
    );
  }
});

export default router;
