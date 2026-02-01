import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/UserManagement.css";

/* ================= CONFIG ================= */
const API_BASE = process.env.REACT_APP_API_BASE_URL;
const BASE_URL = `${API_BASE}/api/users`;
const DEFAULT_STORE_ID = process.env.REACT_APP_STORE_ID_1;

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

const roleLabel = {
  admin: "Quản trị viên",
  customer: "Khách hàng",
};

const UserManagement = () => {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState("");

  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  /* ================= FETCH USERS ================= */
  const fetchUsers = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      let url = `${BASE_URL}/admin/users`;
      if (selectedStore) url += `?storeId=${selectedStore}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-store-id": DEFAULT_STORE_ID,
        },
      });

      setUsers(res.data);
    } catch (err) {
      console.error(err.response || err);
      alert("❌ Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [token, selectedStore]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ================= ACTIONS ================= */
  const handleView = (user) => {
    setSelectedUser(user);
    setShowView(true);
  };

  const handleEdit = (user) => {
    setEditUser({ ...user });
    setShowEdit(true);
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn vô hiệu hóa user này?")) return;

    try {
      await axios.put(
        `${BASE_URL}/admin/users/${id}/deactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-store-id": DEFAULT_STORE_ID,
          },
        }
      );
      fetchUsers();
    } catch {
      alert("❌ Vô hiệu hóa thất bại");
    }
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(
        `${BASE_URL}/admin/users/${editUser._id}`,
        {
          name: editUser.name,
          phone: editUser.phone,
          role: editUser.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-store-id": DEFAULT_STORE_ID,
          },
        }
      );

      setShowEdit(false);
      fetchUsers();
    } catch (err) {
      alert("❌ Cập nhật user thất bại");
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (!token) return <p>❌ Bạn chưa đăng nhập</p>;
  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="user-page">
      {/* HEADER */}
      <div className="user-header">
        <div>
          <h1>Quản lý người dùng</h1>
          <p>Quản lý tài khoản theo từng cửa hàng</p>
        </div>

        <div className="header-actions">
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="">🌍 Tất cả cửa hàng</option>
            {STORES.map(
              (s) =>
                s.id && (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                )
            )}
          </select>

          <input
            className="search-input"
            placeholder="🔍 Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
              <th>Cửa hàng</th>
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
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <span className={`badge role ${u.role}`}>
                    {roleLabel[u.role]}
                  </span>
                </td>
                <td>
                  {STORES.find((s) => s.id === u.storeId)?.name ||
                    "Toàn hệ thống"}
                </td>
                <td align="right">
                  <div className="action-group">
                    <button
                      className="icon-btn view"
                      onClick={() => handleView(u)}
                    >
                      👁
                    </button>
                    <button
                      className="icon-btn edit"
                      onClick={() => handleEdit(u)}
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-btn danger"
                      onClick={() => handleDeactivate(u._id)}
                    >
                      🚫
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" align="center" style={{ padding: 30 }}>
                  Không có người dùng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {showView && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
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

      {/* EDIT MODAL */}
      {showEdit && editUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Chỉnh sửa người dùng</h3>

            <label>Họ tên</label>
            <input
              value={editUser.name}
              onChange={(e) =>
                setEditUser({ ...editUser, name: e.target.value })
              }
            />

            <label>SĐT</label>
            <input
              value={editUser.phone}
              onChange={(e) =>
                setEditUser({ ...editUser, phone: e.target.value })
              }
            />

            <label>Vai trò</label>
            <select
              value={editUser.role}
              onChange={(e) =>
                setEditUser({ ...editUser, role: e.target.value })
              }
            >
              <option value="user">Khách hàng</option>
              <option value="admin">Quản trị viên</option>
            </select>

            <div className="modal-actions">
              <button onClick={() => setShowEdit(false)}>Hủy</button>
              <button className="btn-primary" onClick={handleUpdateUser}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
