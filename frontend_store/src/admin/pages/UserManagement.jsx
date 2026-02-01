import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/UserManagement.css";

const API_URL = "http://localhost:8000/api/users";

const roleLabel = {
  admin: "Quản trị viên",
  staff: "Nhân viên",
  user: "Khách hàng",
};

const UserManagement = () => {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // search
  const [search, setSearch] = useState("");

  // modal
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  /* ================= FETCH USERS ================= */
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      alert("❌ Lỗi tải danh sách user");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ================= SEARCH FILTER ================= */
  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= ACTIONS ================= */
  const handleView = (user) => {
    setSelectedUser(user);
    setShowView(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEdit(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa user này?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch {
      alert("❌ Xóa thất bại");
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/${selectedUser._id}`, selectedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowEdit(false);
      fetchUsers();
    } catch {
      alert("❌ Cập nhật thất bại");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="user-page">
      {/* HEADER */}
      <div className="user-header">
        <div>
          <h1>Danh sách tài khoản</h1>
          <p>Quản lý người dùng trong hệ thống</p>
        </div>

        <div className="header-actions">
          <input
            className="search-input"
            placeholder="🔍 Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-primary">+ Tạo tài khoản</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Vai trò</th>
              <th align="right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="user-name">
                    <div className="avatar">{u.name?.[0]}</div>
                    <strong>{u.name}</strong>
                  </div>
                </td>

                <td className="email">{u.email}</td>
                <td>{u.phone}</td>

                <td>
                  <span className={`badge role ${u.role}`}>
                    {roleLabel[u.role]}
                  </span>
                </td>

                <td align="right">
                  <div className="action-group">
                    <button
                      className="icon-btn"
                      onClick={() => handleView(u)}
                    >
                      👁
                    </button>
                    <button
                      className="icon-btn edit"
                      onClick={() => handleEdit(u)}
                    >
                      ✏
                    </button>
                    <button
                      className="icon-btn danger"
                      onClick={() => handleDelete(u._id)}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" align="center" style={{ padding: 30 }}>
                  Không tìm thấy người dùng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {showView && selectedUser && (
        <div className="modal-overlay">
          <div className="modal view">
            <h3>Chi tiết người dùng</h3>

            <div className="info-row">
              <span>Họ tên</span>
              <strong>{selectedUser.name}</strong>
            </div>

            <div className="info-row">
              <span>Email</span>
              <strong>{selectedUser.email}</strong>
            </div>

            <div className="info-row">
              <span>SĐT</span>
              <strong>{selectedUser.phone}</strong>
            </div>

            <div className="info-row">
              <span>Vai trò</span>
              <strong>{roleLabel[selectedUser.role]}</strong>
            </div>

            <button onClick={() => setShowView(false)}>Đóng</button>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {showEdit && selectedUser && (
        <div className="modal-overlay">
          <div className="modal edit">
            <h3>Cập nhật thông tin</h3>

            <label>Họ tên</label>
            <input
              value={selectedUser.name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, name: e.target.value })
              }
            />

            <label>Email</label>
            <input value={selectedUser.email} disabled />

            <label>Số điện thoại</label>
            <input
              value={selectedUser.phone}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, phone: e.target.value })
              }
            />

            <label>Vai trò</label>
            <select
              value={selectedUser.role}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, role: e.target.value })
              }
            >
              <option value="admin">Quản trị viên</option>
              <option value="staff">Nhân viên</option>
              <option value="customer">Khách hàng</option>
            </select>

            <div className="modal-actions">
              <button onClick={() => setShowEdit(false)}>Hủy</button>
              <button className="btn-primary" onClick={handleSave}>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
