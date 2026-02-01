import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboards.css";

import DashboardCharts from "../components/DashboardCharts.jsx";
import StoreChart from "../components/StoreChart.jsx";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/orders/dashboard/by-store`;

const STORES = [
  {
    id: process.env.REACT_APP_STORE_ID_1,
    name: process.env.REACT_APP_STORE_NAME_1,
  },
  {
    id: process.env.REACT_APP_STORE_ID_2,
    name: process.env.REACT_APP_STORE_NAME_2,
  },
];

const Dashboard = () => {
  const [stores, setStores] = useState([]);
  const [system, setSystem] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    canceledOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      /**
       * ✅ MAP THEO STORES (KHÔNG MAP THEO API)
       * => luôn đúng thứ tự cửa hàng
       */
      const mappedStores = STORES.map((store) => {
        const stat = res.data.find(
          (item) => item.storeId === store.id
        );

        return {
          storeId: store.id,
          storeName: store.name,
          totalRevenue: stat?.totalRevenue || 0,
          totalOrders: stat?.totalOrders || 0,
          completedOrders: stat?.completedOrders || 0,
          canceledOrders: stat?.canceledOrders || 0,
        };
      });

      setStores(mappedStores);

      // ===== TỔNG TOÀN HỆ THỐNG =====
      const systemTotal = mappedStores.reduce(
        (acc, cur) => {
          acc.totalRevenue += cur.totalRevenue;
          acc.totalOrders += cur.totalOrders;
          acc.completedOrders += cur.completedOrders;
          acc.canceledOrders += cur.canceledOrders;
          return acc;
        },
        {
          totalRevenue: 0,
          totalOrders: 0,
          completedOrders: 0,
          canceledOrders: 0,
        }
      );

      setSystem(systemTotal);
      setLoading(false);
    } catch (error) {
      console.error("Dashboard error:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="loading">Loading dashboard...</p>;
  }

  return (
    <div className="dashboard-container">
      <h1>📊 Thống kê</h1>

      {/* ================= SYSTEM SUMMARY ================= */}
      <div className="summary">
        <div className="card">
          <h3>Tổng doanh thu</h3>
          <p>{system.totalRevenue.toLocaleString()} đ</p>
        </div>

        <div className="card">
          <h3>Tổng đơn hàng</h3>
          <p>{system.totalOrders}</p>
        </div>

        <div className="card success">
          <h3>Đơn hoàn thành</h3>
          <p>{system.completedOrders}</p>
        </div>

        <div className="card danger">
          <h3>Đơn huỷ</h3>
          <p>{system.canceledOrders}</p>
        </div>
      </div>

      {/* ================= SYSTEM CHARTS ================= */}
      <DashboardCharts stores={stores} system={system} />

      {/* ================= STORE DASHBOARD ================= */}
      <h2>📍 Thống kê theo cửa hàng</h2>

      <div className="store-dashboard">
        {stores.map((store) => (
          <div className="store-card" key={store.storeId}>
            <div className="store-title">🏬 {store.storeName}</div>

            {/* ==== STORE STATS ==== */}
            <div className="store-stats">
              <div className="stat-box stat-revenue">
                <h4>Doanh thu</h4>
                <p>{store.totalRevenue.toLocaleString()} đ</p>
              </div>

              <div className="stat-box stat-orders">
                <h4>Tổng đơn</h4>
                <p>{store.totalOrders}</p>
              </div>

              <div className="stat-box stat-success">
                <h4>Hoàn thành</h4>
                <p>{store.completedOrders}</p>
              </div>

              <div className="stat-box stat-cancel">
                <h4>Đơn huỷ</h4>
                <p>{store.canceledOrders}</p>
              </div>
            </div>

            {/* ==== STORE CHART ==== */}
            <StoreChart store={store} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
