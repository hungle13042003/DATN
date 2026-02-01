import Order from "../models/Order.js";
import axios from "axios";

const INVENTORY_SERVICE_URL =
  "http://inventory_service:3006/api/inventory";

const CART_SERVICE_URL =
  "http://cart_service:3003/api/cart";

/**
 * ===============================
 * CREATE ORDER
 * ===============================
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.storeId;

    const {
      items,
      shippingInfo,
      voucherCode,
      paymentMethod,
      shippingMethod,
      totalAmount,
      discountAmount,
      finalAmount,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Đơn hàng trống" });
    }

    // 1️⃣ TRỪ TỒN KHO THEO SIZE
    for (const item of items) {
      try {
        await axios.post(
          `${INVENTORY_SERVICE_URL}/decrease`,
          {
            productId: item.productId,
            size: item.size,        // 🔥 FIX
            quantity: item.quantity,
          },
          {
            headers: {
              "x-store-id": storeId,
            },
          }
        );
      } catch (err) {
        return res.status(400).json({
          message:
            err.response?.data?.message ||
            "Không đủ hàng trong kho",
        });
      }
    }

    // 2️⃣ TẠO ORDER
    const order = await Order.create({
      orderCode: "ORD" + Date.now(),
      userId,
      storeId,
      items,
      shippingInfo,
      voucherCode,
      paymentMethod,
      shippingMethod,
      totalAmount,
      discountAmount,
      finalAmount,
    });

    // 3️⃣ CLEAR CART
    await axios.post(
      `${CART_SERVICE_URL}/clear`,
      {},
      {
        headers: {
          Authorization: req.headers.authorization,
          "x-store-id": storeId.toString(),
        },
      }
    );

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công",
      data: order,
    });
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({
      message: "Lỗi tạo đơn hàng",
    });
  }
};

/**
 * ===============================
 * USER: MY ORDERS
 * ===============================
 */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy đơn hàng" });
  }
};

/**
 * ===============================
 * USER: ORDER DETAIL
 * ===============================
 */
export const getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy chi tiết đơn hàng" });
  }
};

/**
 * ===============================
 * ADMIN: ORDERS BY STORE
 * ===============================
 */
export const getAllOrdersByStore = async (req, res) => {
  try {
    const storeId = req.storeId;

    const orders = await Order.find({ storeId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng" });
  }
};

/**
 * ===============================
 * ADMIN: UPDATE STATUS
 * ===============================
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
  }
};


/**
 * ===============================
 * SUPER ADMIN / ADMIN: ALL ORDERS
 * ===============================
 */
export const getAllOrdersSystem = async (req, res) => {
  try {
    const { storeId } = req.query;

    const filter = {};
    if (storeId) filter.storeId = storeId;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("getAllOrdersSystem error:", error);
    res.status(500).json({
      message: "Lỗi lấy đơn hàng toàn hệ thống",
    });
  }
};

// /**
//  * DASHBOARD STATISTICS
//  */
// export const getDashboardStats = async (req, res) => {
//   try {
//     const result = await Order.aggregate([
//       {
//         $match: { status: "COMPLETED" }
//       },
//       {
//         $group: {
//           _id: "$storeId",
//           revenue: { $sum: "$finalAmount" },
//           orders: { $sum: 1 }
//         }
//       }
//     ]);

//     // ===== TÁCH RIÊNG TỪNG CỬA HÀNG =====
//     const stores = result.map(item => ({
//       storeId: item._id,
//       totalRevenue: item.revenue,
//       totalOrders: item.orders
//     }));

//     // ===== TỔNG HỆ THỐNG =====
//     const systemTotal = {
//       totalRevenue: stores.reduce((s, i) => s + i.totalRevenue, 0),
//       totalOrders: stores.reduce((s, i) => s + i.totalOrders, 0)
//     };

//     res.json({
//       system: systemTotal,
//       stores
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Dashboard error" });
//   }
// };

export const getDashboardSummary = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "COMPLETED"] }, "$finalAmount", 0],
            },
          },
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] },
          },
          canceledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "CANCELED"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json(
      stats[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        completedOrders: 0,
        canceledOrders: 0,
      }
    );
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ message: "Dashboard summary error" });
  }
};

export const getDashboardByStore = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$storeId",
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "COMPLETED"] }, "$finalAmount", 0],
            },
          },
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] },
          },
          canceledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          storeId: "$_id",
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1,
          completedOrders: 1,
          canceledOrders: 1,
        },
      },
    ]);

    res.json(stats);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Dashboard error" });
  }
};