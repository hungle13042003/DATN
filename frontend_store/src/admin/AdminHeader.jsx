const AdminHeader = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
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
