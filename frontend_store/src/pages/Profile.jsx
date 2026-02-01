import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/profile.css";

const USER_API = `${process.env.REACT_APP_API_BASE_URL}/api/users`;
const PROMOTION_API = `${process.env.REACT_APP_API_BASE_URL}/api/promotions`;

const Profile = () => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = useCallback(async () => {
    const res = await axios.get(`${USER_API}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(res.data);
    setForm({
      name: res.data.name || "",
      email: res.data.email || "",
      phone: res.data.phone || "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [token]);

  /* ================= FETCH VOUCHERS ================= */
  const fetchVouchers = useCallback(async () => {
    const res = await axios.get(PROMOTION_API);
    setVouchers(res.data || []);
  }, []);

  useEffect(() => {
    if (!token) return;

    Promise.all([fetchProfile(), fetchVouchers()]).finally(() =>
      setLoading(false)
    );
  }, [token, fetchProfile, fetchVouchers]);

  /* ================= UPDATE PROFILE ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      alert("❌ Mật khẩu mới không khớp");
      return;
    }

    try {
      await axios.put(
        `${USER_API}/users/me`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.newPassword || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Cập nhật thông tin thành công");
      setIsEdit(false);
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Lỗi cập nhật");
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (!user) return <div>Không có dữ liệu</div>;

  return (
    <>
      <Header />

      <main className="profile-page">
        <div className="profile-container">
          {/* ===== SIDEBAR ===== */}
          <aside className="profile-sidebar">
            <img
              src="/assets/avatar/anh1.png"
              alt="avatar"
              className="profile-avatar"
            />
            <h3>{user.name}</h3>
            <p className="profile-role">
              {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
            </p>
          </aside>

          {/* ===== CONTENT ===== */}
          <section className="profile-content">
            {/* ===== THÔNG TIN CÁ NHÂN ===== */}
            {!isEdit ? (
              <div className="profile-card">
                <h2>Thông tin cá nhân</h2>

                <div className="info-row">
                  <span>Họ tên</span>
                  <strong>{user.name}</strong>
                </div>

                <div className="info-row">
                  <span>Email</span>
                  <strong>{user.email}</strong>
                </div>

                <div className="info-row">
                  <span>SĐT</span>
                  <strong>{user.phone || "---"}</strong>
                </div>

                <button className="edit-btn" onClick={() => setIsEdit(true)}>
                  Sửa thông tin
                </button>
              </div>
            ) : (
              <div className="profile-card">
                <h2>Cập nhật thông tin</h2>

                <form onSubmit={handleUpdate}>
                  <div className="form-row">
                    <label>Họ tên</label>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-row">
                    <label>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-row">
                    <label>Số điện thoại</label>
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>

                  <hr />

                  <div className="form-row">
                    <label>Mật khẩu mới</label>
                    <input
                      type="password"
                      onChange={(e) =>
                        setForm({ ...form, newPassword: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-row">
                    <label>Nhập lại mật khẩu</label>
                    <input
                      type="password"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-actions">
                    <button className="save-btn">Cập nhật</button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setIsEdit(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ===== SỔ VOUCHER ===== */}
            <div className="profile-card">
              <h2>Voucher của bạn</h2>

              <div className="address-list">
                {vouchers.length === 0 && (
                  <p style={{ fontSize: 14, color: "#6b7280" }}>
                    Chưa có voucher nào
                  </p>
                )}

                {vouchers.map((v) => (
                  <div key={v._id} className="address-card">
                    <p>
                      <b>Mã:</b> {v.code}
                    </p>
                    <p>
                      Giảm:{" "}
                      {v.discountType === "PERCENT"
                        ? `${v.discountValue}%`
                        : `${v.discountValue.toLocaleString()}₫`}
                    </p>
                    <p>
                      Đơn tối thiểu:{" "}
                      {v.minOrderValue.toLocaleString()}₫
                    </p>
                    <p>
                      Hạn dùng:{" "}
                      {new Date(v.endDate).toLocaleDateString()}
                    </p>

                    {v.isActive && (
                      <span className="default-badge">Đang áp dụng</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Profile;
