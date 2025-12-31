import Order from "../models/Order.js";
import axios from "axios";

/* ================= USER ================= */

// Tạo đơn hàng
export const createOrder = async (req, res) => {
  try {
    const { items, voucherCode } = req.body;

    let totalAmount = 0;

    items.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    let discountAmount = 0;
    let finalAmount = totalAmount;

    // Gọi Promotion Service
    if (voucherCode) {
      const promoRes = await axios.post(
        `${process.env.PROMOTION_SERVICE_URL}/apply/voucher`,
        {
          code: voucherCode,
          orderValue: totalAmount,
        }
      );

      discountAmount = promoRes.data.discountAmount;
      finalAmount = promoRes.data.finalAmount;
    }

    const order = await Order.create({
      userId: req.user.userId,
      items,
      totalAmount,
      discountAmount,
      finalAmount,
      voucherCode,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi tạo đơn hàng",
      error: error.message,
    });
  }
};

// Lấy đơn hàng của user
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.userId }).sort({
    createdAt: -1,
  });
  res.json(orders);
};

/* ================= ADMIN ================= */

// Lấy tất cả đơn hàng
export const getAllOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

// Cập nhật trạng thái đơn
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!order)
    return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

  res.json(order);
};
