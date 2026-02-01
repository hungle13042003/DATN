import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaMoneyBillWave,
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import "../styles/Dashboards.css";

const API_BASE = "http://localhost:8000/api/orders/admin/statistics";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  const [overview, setOverview] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Tổng quan
    axios
      .get(`${API_BASE}/overview`, { headers })
      .then((res) => setOverview(res.data))
      .catch(console.error);

    // Doanh thu theo tháng
    axios
      .get(`${API_BASE}/revenue-month`, { headers })
      .then((res) => setRevenueData(res.data))
      .catch(console.error);

    // Đơn hàng theo tháng
    axios
      .get(`${API_BASE}/orders-month`, { headers })
      .then((res) => setOrderData(res.data))
      .catch(console.error);
  }, [token]);

  return (
    <div className="dashboard">

      {/* ===== STAT CARDS ===== */}
      <div className="stat-grid">

        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaMoneyBillWave />
          </div>
          <div>
            <p>Tổng doanh thu</p>
            <h3>
              {overview.totalRevenue?.toLocaleString("vi-VN")} đ
            </h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <FaBoxOpen />
          </div>
          <div>
            <p>Tổng đơn hàng</p>
            <h3>{overview.totalOrders}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <FaCheckCircle />
          </div>
          <div>
            <p>Đơn hoàn thành</p>
            <h3>{overview.completedOrders}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cancel">
            <FaTimesCircle />
          </div>
          <div>
            <p>Đơn hủy</p>
            <h3>{overview.cancelledOrders}</h3>
          </div>
        </div>

      </div>

      {/* ===== CHARTS ===== */}
      <div className="chart-grid">

        <div className="chart-card">
          <h4>📈 Doanh thu theo tháng</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>📊 Số đơn hàng theo tháng</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
