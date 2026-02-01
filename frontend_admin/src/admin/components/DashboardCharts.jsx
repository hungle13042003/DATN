import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "../styles/DashboardCharts.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const DashboardCharts = ({ stores, system }) => {
  const revenueData = {
    labels: stores.map((s) => s.storeName),
    datasets: [
      {
        label: "Doanh thu (đ)",
        data: stores.map((s) => s.totalRevenue),
        backgroundColor: "#2563eb",
        borderRadius: 8,
      },
    ],
  };

  const orderStatusData = {
    labels: ["Hoàn thành", "Đơn huỷ"],
    datasets: [
      {
        data: [system.completedOrders, system.canceledOrders],
        backgroundColor: ["#16a34a", "#dc2626"],
      },
    ],
  };

  return (
    <div className="chart-container">
      <div className="chart-card">
        <h3>📊 Doanh thu theo cửa hàng</h3>
        <Bar data={revenueData} />
      </div>

      <div className="chart-card">
        <h3>🥧 Tỷ lệ trạng thái đơn hàng</h3>
        <Pie data={orderStatusData} />
      </div>
    </div>
  );
};

export default DashboardCharts;
