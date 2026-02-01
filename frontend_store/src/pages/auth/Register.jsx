import Header from "../../components/Header";
import "../../styles/register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

const API_BASE = process.env.REACT_APP_API_BASE_URL;
const STORE_ID = process.env.REACT_APP_STORE_ID;

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Mật khẩu nhập lại không khớp!",
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/users/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          storeId: STORE_ID,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Đăng ký thất bại",
          text: data.message,
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/login"));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi kết nối",
        text: "Không thể kết nối server!",
      });
    }
  };

  return (
    <>
      <Header />

      <main className="register-page">
        <div className="register-container">

          <div className="register-image">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4j1D5Zv6AzPzlfAPJnnrDX3tchwdkUmRqD41oXoOcku-Ny-_0cP_2XN5W0YR-l-6Ilpvcm8wIVgk0LWUcy-gN6q1utpsyCVySHzfMj8Ge5_LzJNWjSGz0NZwJxE-0xbrziPgsb_IFKWc9iXptWS_mrqz5bFVAmHJegd4vjVihu980SlGd3Ur542yVMEIg-qy6bGrd486JI-HKdtgXxsPciDXceewbTD1OvYH45fnGcG0VBcXmHBcbXVKR-vcW0WgCZi2jTlw_XiPt"
              alt="Fashion Register"
            />
          </div>

          <div className="register-form">
            <h1>Đăng ký thành viên</h1>

            <form onSubmit={handleSubmit}>
              <label>Họ tên</label>
              <input name="name" onChange={handleChange} required />

              <label>Email</label>
              <input type="email" name="email" onChange={handleChange} required />

              <label>Số điện thoại</label>
              <input name="phone" onChange={handleChange} required />

              <label>Mật khẩu</label>
              <input type="password" name="password" onChange={handleChange} required />

              <label>Nhập lại mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                required
              />

              <button type="submit" className="submit-btn">
                Đăng ký ngay
              </button>
            </form>

            <p className="login-link">
              Đã có tài khoản?
              <Link to="/login"> Đăng nhập</Link>
            </p>
          </div>

        </div>
      </main>
    </>
  );
}

export default Register;
