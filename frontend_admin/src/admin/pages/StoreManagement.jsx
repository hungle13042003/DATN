import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/storeManagement.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    code: "",
    name: "",
    address: "",
    phone: "",
  });

  const token = localStorage.getItem("token");

  /* ================= FETCH STORES ================= */
  const fetchStores = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/stores/stores`);
      setStores(res.data);
    } catch (err) {
      console.error("Lỗi lấy cửa hàng", err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  /* ================= CREATE STORE ================= */
  const createStore = async () => {
    if (!form.code || !form.name || !form.address) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/stores/admin/stores`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowModal(false);
      setForm({ code: "", name: "", address: "", phone: "" });
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi tạo cửa hàng");
    }
  };

  /* ================= DEACTIVATE ================= */
  const deactivateStore = async (id) => {
    if (!window.confirm("Bạn có chắc muốn ngừng cửa hàng này?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/stores/admin/stores/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchStores();
    } catch (err) {
      alert("Lỗi ngừng cửa hàng");
    }
  };

  /* ================= SEARCH ================= */
  const filteredStores = stores.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="store-container">
      <h2 className="store-title">🏪 Quản lý cửa hàng</h2>

      {/* ===== TOOLBAR ===== */}
      <div className="store-toolbar">
        <input
          className="search-input"
          placeholder="🔍 Tìm theo tên cửa hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="add-btn" onClick={() => setShowModal(true)}>
          ➕ Thêm cửa hàng
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="store-card">
        <table>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên cửa hàng</th>
              <th>Địa chỉ</th>
              <th>SĐT</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filteredStores.map((store) => (
              <tr key={store._id}>
                <td>{store.code}</td>
                <td>{store.name}</td>
                <td>{store.address}</td>
                <td>{store.phone || "—"}</td>
                <td>
                  {store.isActive ? (
                    <span className="status active">Hoạt động</span>
                  ) : (
                    <span className="status inactive">Ngừng</span>
                  )}
                </td>
                <td>
                  {store.isActive && (
                    <button
                      className="danger-btn"
                      onClick={() => deactivateStore(store._id)}
                    >
                      ⛔ Ngừng
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {filteredStores.length === 0 && (
              <tr>
                <td colSpan="6" className="empty">
                  Không có cửa hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== MODAL CREATE ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal modern">
            <h3>➕ Tạo cửa hàng mới</h3>

            <div className="form-group">
              <label>Mã cửa hàng</label>
              <input
                placeholder="VD: HN-CG-01"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Tên cửa hàng</label>
              <input
                placeholder="Cửa hàng Hà Nội - Cầu Giấy"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                placeholder="Số 1 Trần Duy Hưng, Cầu Giấy"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                placeholder="0901000001"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>

            <div className="modal-actions">
              <button className="cancel" onClick={() => setShowModal(false)}>
                Hủy
              </button>
              <button className="primary" onClick={createStore}>
                Tạo cửa hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;
