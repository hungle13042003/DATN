// controllers/paymentController.js
import { createVNPayUrl } from "../utils/vnpay.js";

export const createPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ message: "Thiếu orderId hoặc amount" });
    }

    // Luôn gán giá trị mặc định cho IP
    const ipAddr =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress?.replace("::ffff:", "") ||
      "127.0.0.1";

    const paymentUrl = createVNPayUrl({
      orderId,
      amount,
      returnUrl: process.env.VNP_RETURN_URL,
      ipAddr, // đảm bảo không undefined
    });

    return res.json({ paymentUrl });
  } catch (error) {
    console.error("VNPay createPayment error:", error);
    return res.status(500).json({ message: error.message });
  }
};
