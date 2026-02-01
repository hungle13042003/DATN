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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const StoreChart = ({ store }) => {
  const barData = {
    labels: ["Hoàn thành", "Đơn huỷ"],
    datasets: [
      {
        label: "Số đơn",
        data: [store.completedOrders, store.canceledOrders],
        backgroundColor: ["#16a34a", "#dc2626"],
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["Hoàn thành", "Huỷ"],
    datasets: [
      {
        data: [store.completedOrders, store.canceledOrders],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="store-chart">
      <div className="store-chart-item">
        <h4>📊 Trạng thái đơn hàng</h4>
        <Bar data={barData} />
      </div>

      <div className="store-chart-item">
        <h4>🥧 Tỷ lệ đơn hàng</h4>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default StoreChart;
