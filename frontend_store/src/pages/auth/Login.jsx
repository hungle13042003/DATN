import Header from "../../components/Header";
import "../../styles/login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/users/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-store-id": process.env.REACT_APP_STORE_ID,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công!",
          timer: 1200,
          showConfirmButton: false,
        }).then(() => navigate("/"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Đăng nhập thất bại",
          text: data.message || "Sai email hoặc mật khẩu",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi kết nối",
        text: "Không thể kết nối server!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="login-page">
        <div className="login-container">

          <div className="login-image">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK9fPtM_Si9lgG67ItXviEbmCSkQADk_SKMDB8moFSruAzNqtv-Fi60CV133HF5X53NWaM_JH7O3jrZe4d4yuFOA0GPGaaeVQU1RYifKUi8p53sQ0rEYYARcS1aSdwdD1Boc6wgHjddHY21R3quUHZ9QpaEgwKgA93rJca_GPFBbzrW5WJ_q_KqY3F5HkkbUxjsk0xUtKTfZtxqf1IDYStcRlTKnyih9H9A5mwdsgbxPbCpbvYH31tWg4JcIuNq9hovZDLdjFc60Fq"
              alt="Fashion"
            />
            <div className="image-overlay">
              <h2>Bộ Sưu Tập Mùa Hè 2024</h2>
              <p>Khám phá phong cách mới nhất dành riêng cho bạn.</p>
            </div>
          </div>

          <div className="login-form">
            <h1>Đăng nhập</h1>
            <p className="subtitle">
              Chào mừng bạn quay trở lại với Fashionistore! CN:99 Quang Trung
            </p>

            <form onSubmit={handleSubmit}>
              <label>Email</label>
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="icon">✉</span>
              </div>

              <label>Mật khẩu</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁
                </button>
              </div>

              <div className="forgot">
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập →"}
              </button>
            </form>

            <p className="register">
              Bạn chưa có tài khoản?
              <Link to="/register"> Đăng ký ngay</Link>
            </p>
          </div>

        </div>
      </main>
    </>
  );
}

export default Login;
