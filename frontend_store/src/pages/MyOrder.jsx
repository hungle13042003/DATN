import React, { useEffect, useState, useCallback } from "react";
import "../styles/myOrders.css";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = "http://localhost:8000/api/orders";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi lấy đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token, fetchOrders]);

  /* ================= HELPERS ================= */
  const translateStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang xử lý";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "SHIPPING":
        return "Đang giao hàng";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#f59e0b";
      case "CONFIRMED":
        return "#3b82f6";
      case "SHIPPING":
        return "#0b928b";
      case "COMPLETED":
        return "#22c55e";
      case "CANCELLED":
        return "#ef4444";
      default:
        return "#6b8070";
    }
  };

  return (
    <>
      <Header />

      <div className="my-orders">
        <h2>Đơn hàng của tôi</h2>

        {loading ? (
          <p className="loading-text">Đang tải đơn hàng...</p>
        ) : orders.length === 0 ? (
          <p className="empty-text">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="orders-container">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                {/* ===== HEADER ===== */}
                <div className="order-header">
                  <div>
                    <p className="order-id">
                      Mã đơn: <b>#{order._id.slice(-6)}</b>
                    </p>
                    <p className="order-date">
                      Ngày đặt:{" "}
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <span
                    className="order-status"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    ● {translateStatus(order.status)}
                  </span>
                </div>

                {/* ===== ITEMS ===== */}
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div className="order-item" key={index}>
                      <div className="order-item-info">
                        <p className="item-name">{item.name}</p>

                        {/* 🔥 SIZE + COLOR */}
                        <p className="item-variant">
                          Size: <b>{item.size || "-"}</b> | Màu:{" "}
                          <b>{item.color || "-"}</b>
                        </p>

                        <p>
                          Giá: {item.price.toLocaleString()}đ ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <div className="item-total">
                        {(item.price * item.quantity).toLocaleString()}đ
                      </div>
                    </div>
                  ))}
                </div>

                {/* ===== SUMMARY ===== */}
                <div className="order-summary">
                  <div>
                    <span>Tạm tính:</span>
                    <span>{order.totalAmount.toLocaleString()}đ</span>
                  </div>

                  {order.discountAmount > 0 && (
                    <div>
                      <span>Giảm giá:</span>
                      <span>
                        -{order.discountAmount.toLocaleString()}đ
                      </span>
                    </div>
                  )}

                  <div className="final-total">
                    <span>Tổng cộng:</span>
                    <span>
                      {order.finalAmount.toLocaleString()}đ
                    </span>
                  </div>

                  {order.voucherCode && (
                    <p className="voucher">
                      Mã ưu đãi: <b>{order.voucherCode}</b>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default MyOrders;
