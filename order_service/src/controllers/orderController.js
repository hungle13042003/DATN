import Order from "../models/Order.js";
import axios from "axios";

/* ================= USER ================= */

// Tạo đơn hàng
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingInfo,
      voucherCode,
      totalAmount,
      finalAmount,
      paymentMethod,
      shippingMethod,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Đơn hàng trống" });
    }

    if (!shippingInfo?.fullName || !shippingInfo?.phone || !shippingInfo?.address) {
      return res.status(400).json({ message: "Thiếu thông tin giao hàng" });
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      shippingInfo,
      voucherCode,
      totalAmount,
      finalAmount,
      discountAmount: totalAmount - finalAmount,
      paymentMethod,
      shippingMethod,
      status: "PENDING",
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
  const orders = await Order.find({ userId: req.user.id }).sort({
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


/* ================= OVERVIEW DASHBOARD ================= */
export const getDashboardOverview = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const completedOrders = await Order.countDocuments({
      status: "COMPLETED",
    });

    const cancelledOrders = await Order.countDocuments({
      status: "CANCELLED",
    });

    const revenueResult = await Order.aggregate([
      { $match: { status: "COMPLETED" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalAmount" },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    res.json({
      totalOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi thống kê tổng quan",
      error: error.message,
    });
  }
};

/* ================= DOANH THU THEO THÁNG ================= */
export const getRevenueByMonth = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { status: "COMPLETED" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$finalAmount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const result = data.map((item) => ({
      month: `Tháng ${item._id}`,
      revenue: item.revenue,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi thống kê doanh thu",
      error: error.message,
    });
  }
};

/* ================= SỐ ĐƠN THEO THÁNG ================= */
export const getOrdersByMonth = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const result = data.map((item) => ({
      month: `Tháng ${item._id}`,
      orders: item.orders,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi thống kê đơn hàng",
      error: error.message,
    });
  }
};
