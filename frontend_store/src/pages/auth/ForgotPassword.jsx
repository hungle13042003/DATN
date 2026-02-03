import Header from "../../components/Header";
import { useState } from "react";
import Swal from "sweetalert2";
import "../../styles/forgotReset.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/users/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-store-id": process.env.REACT_APP_STORE_ID,
          },
          body: JSON.stringify({
            email,
            resetBaseUrl: window.location.origin
          }),
        }
      );;

      const data = await res.json();

      if (res.ok) {
        Swal.fire(
          "Thành công",
          "Vui lòng kiểm tra email để đặt lại mật khẩu",
          "success"
        );
      } else {
        Swal.fire("Lỗi", data.message || "Email không tồn tại", "error");
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
            <h1>Quên mật khẩu</h1>
            <p>Nhập email để nhận link đặt lại mật khẩu</p>

            <form onSubmit={handleSubmit}>
              <label>Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi email"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default ForgotPassword;
