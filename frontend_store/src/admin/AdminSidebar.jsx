import { NavLink } from "react-router-dom";
import "./admin.css";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">FASHION ADMIN</h2>

      <nav className="admin-menu">
        <NavLink to="/admin" end>
          📊 Thống kê
        </NavLink>

        <NavLink to="/admin/users">
          👤 Quản lý người dùng
        </NavLink>

        <NavLink to="/admin/products">
          👕 Quản lý sản phẩm
        </NavLink>

        <NavLink to="/admin/orders">
          📦 Quản lý đơn hàng
        </NavLink>

        <NavLink to="/admin/vouchers">
          🎟 Mã ưu đãi
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
