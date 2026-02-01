const Dashboard = () => {
  return (
    <div className="stat-grid">
      <div className="stat-card">
        <p>Tổng doanh thu</p>
        <h3>1.250.000.000 đ</h3>
      </div>

      <div className="stat-card">
        <p>Đơn hàng mới</p>
        <h3>154</h3>
      </div>

      <div className="stat-card">
        <p>Khách hàng mới</p>
        <h3>45</h3>
      </div>

      <div className="stat-card">
        <p>Sản phẩm sắp hết</p>
        <h3>12</h3>
      </div>
    </div>
  );
};

export default Dashboard;
