import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/orderManagement.css";

const API_URL = "http://localhost:8000/api/orders";
const IMAGE_URL = "http://localhost:3002";
const statusLabel = {
    PENDING: "Chờ xử lý",
    SHIPPING: "Đang giao",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
};

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    const token = localStorage.getItem("token");

    /* ================= FETCH ORDERS ================= */
    useEffect(() => {
        const fetchOrders = async () => {
            const res = await axios.get(`${API_URL}/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(res.data);
        };

        fetchOrders();
    }, [token]);

    /* ================= UPDATE STATUS ================= */
    const updateStatus = async (id, status) => {
        await axios.put(
            `${API_URL}/admin/orders/${id}`,
            { status },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        setOrders((prev) =>
            prev.map((o) => (o._id === id ? { ...o, status } : o))
        );
    };

    /* ================= SEARCH ================= */
    const filteredOrders = orders.filter((order) => {
        const keyword = search.toLowerCase();
        return (
            order.shippingInfo.fullName.toLowerCase().includes(keyword) ||
            order.shippingInfo.phone.includes(keyword)
        );
    });

    return (
        <div className="order-container">
            <h2 className="order-title">📦 Quản lý đơn hàng</h2>

            <input
                className="search-input"
                placeholder="🔍 Tìm theo tên hoặc SĐT..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="order-card">
                <table>
                    <thead>
                        <tr>
                            <th>Tên khách hàng</th>
                            <th>SĐT</th>
                            <th>Địa chỉ</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order._id}>
                                <td>{order.shippingInfo.fullName}</td>
                                <td>{order.shippingInfo.phone}</td>
                                <td className="address">
                                    {order.shippingInfo.address}
                                </td>
                                <td>
                                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                </td>
                                <td className="price">
                                    {order.finalAmount.toLocaleString("vi-VN")} đ
                                </td>
                                <td>
                                    <span className={`status ${order.status}`}>
                                        {statusLabel[order.status]}
                                    </span>
                                </td>
                                <td className="actions">
                                    <button
                                        className="view-btn"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        👁
                                    </button>

                                    <select
                                        value={order.status}
                                        onChange={(e) =>
                                            updateStatus(order._id, e.target.value)
                                        }
                                    >
                                        {Object.keys(statusLabel).map((key) => (
                                            <option key={key} value={key}>
                                                {statusLabel[key]}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}

                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="7" className="empty">
                                    Không có đơn hàng
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ================= POPUP DETAIL ================= */}
            {selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Chi tiết đơn hàng</h3>

                        <p><b>Mã đơn:</b> {selectedOrder._id}</p>
                        <p><b>Tên:</b> {selectedOrder.shippingInfo.fullName}</p>
                        <p><b>SĐT:</b> {selectedOrder.shippingInfo.phone}</p>
                        <p><b>Địa chỉ:</b> {selectedOrder.shippingInfo.address}</p>
                        <p>
                            <b>Ngày đặt:</b>{" "}
                            {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                        </p>
                        <p>
                            <b>Tổng tiền:</b>{" "}
                            {selectedOrder.finalAmount.toLocaleString("vi-VN")} đ
                        </p>

                        <h4>Sản phẩm</h4>
                        {selectedOrder.items.map((item, index) => (
                            <div className="item-row" key={index}>
                                <img
                                    src={
                                        item.image
                                            ? `${IMAGE_URL}${item.image}`
                                            : item.images?.[0]
                                                ? `${IMAGE_URL}${item.images[0]}`
                                                : "https://via.placeholder.com/60x60"
                                    }
                                    alt={item.name}
                                />
                                <div>
                                    <p className="item-name">{item.name}</p>
                                    <p className="item-qty">
                                        SL: {item.quantity} × {item.price.toLocaleString()} đ
                                    </p>
                                </div>
                            </div>
                        ))}
                        <button
                            className="close-btn"
                            onClick={() => setSelectedOrder(null)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
