import Payment from "../models/Payment.js";
import axios from "axios";

/* ================= USER ================= */

// Tạo thanh toán
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;

    const payment = await Payment.create({
      orderId,
      userId: req.user.userId,
      amount,
      method
    });

    // COD → thành công ngay
    if (method === "COD") {
      payment.status = "SUCCESS";
      await payment.save();

      // cập nhật order
      await axios.put(
        `${process.env.ORDER_SERVICE_URL}/admin/orders/${orderId}`,
        { status: "CONFIRMED" },
        {
          headers: {
            Authorization: req.headers.authorization
          }
        }
      );
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi tạo thanh toán",
      error: error.message
    });
  }
};

// Lấy lịch sử thanh toán của user
export const getMyPayments = async (req, res) => {
  const payments = await Payment.find({ userId: req.user.userId }).sort({
    createdAt: -1
  });
  res.json(payments);
};

/* ================= ADMIN ================= */

// Lấy tất cả thanh toán
export const getAllPayments = async (req, res) => {
  const payments = await Payment.find().sort({ createdAt: -1 });
  res.json(payments);
};

// Admin xác nhận thanh toán online
export const confirmPayment = async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { status: "SUCCESS" },
    { new: true }
  );

  if (!payment) {
    return res.status(404).json({ message: "Không tìm thấy thanh toán" });
  }

  res.json(payment);
};
