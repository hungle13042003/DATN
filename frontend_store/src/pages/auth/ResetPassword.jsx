import Header from "../../components/Header";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../styles/forgotReset.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return Swal.fire("Lỗi", "Mật khẩu không khớp", "error");
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/users/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire(
          "Thành công",
          "Đặt lại mật khẩu thành công",
          "success"
        ).then(() => navigate("/login"));
      } else {
        Swal.fire("Lỗi", data.message || "Token không hợp lệ", "error");
      }
    } catch {
      Swal.fire("Lỗi", "Không kết nối được server", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="forgot-page">
        <div className="forgot-container">
          <div className="forgot-form">
            <h1>Đặt lại mật khẩu</h1>
            <p>Nhập mật khẩu mới của bạn</p>

            <form onSubmit={handleSubmit}>
              <label>Mật khẩu mới</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <label>Xác nhận mật khẩu</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default ResetPassword;
