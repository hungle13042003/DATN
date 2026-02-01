import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/adminLogin.css";

const AdminLogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/users/admin/auth/login`,
                { email, password }
            );

            if (!["admin", "super_admin"].includes(res.data.admin.role)) {
                setError("Bạn không có quyền quản trị");
                return;
            }

            localStorage.setItem("admin_token", res.data.token);
            localStorage.setItem("admin_info", JSON.stringify(res.data.admin));

            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Đăng nhập thất bại");
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-box">
                {/* LEFT IMAGE */}
                <div className="admin-login-banner">
                    <div className="banner-content">
                        <h1>Admin Panel</h1>
                        <p>Hệ thống quản lý cửa hàng & đơn hàng</p>
                    </div>
                </div>

                {/* RIGHT FORM */}
                <form className="admin-login-form" onSubmit={handleSubmit}>
                    <h2>Đăng nhập quản trị</h2>

                    {error && <p className="admin-login-error">{error}</p>}

                    <input
                        type="email"
                        placeholder="Email admin"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Đăng nhập</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
