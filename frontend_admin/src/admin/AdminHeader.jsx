import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_info");

    navigate("/admin/login");
  };

  return (
    <header className="admin-header">
      <h2>Quản trị hệ thống</h2>

      <button onClick={handleLogout}>
        Đăng xuất
      </button>
    </header>
  );
};

export default AdminHeader;