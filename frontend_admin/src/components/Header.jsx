import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/header.css";

function Header() {
  const navigate = useNavigate();

  // giả lập trạng thái đăng nhập (sau này lấy từ JWT)
  const isLoggedIn = !!localStorage.getItem("token");

  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* LEFT */}
        <div className="header-left">
          <span className="logo-icon">△</span>
          <span className="logo-text">FASHION STORE</span>
        </div>

        {/* CENTER */}
        <nav className="header-menu">
          <Link to="/">Trang chủ</Link>
          <Link to="/category/ao">Áo</Link>
          <Link to="/category/quan">Quần</Link>
          <Link to="/category/giay">Giày</Link>
          <Link to="/category/phukien" className="phukien">Phụ kiện</Link>
        </nav>

        {/* RIGHT */}
        <div className="header-right">
          <input
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
          />

          {/* CHƯA ĐĂNG NHẬP */}
          {!isLoggedIn && (
            <Link to="/login" className="login-btn">
              Đăng nhập
            </Link>
          )}

          {/* ĐÃ ĐĂNG NHẬP */}
          {isLoggedIn && (
            <>
              {/* USER ICON */}
              <div className="user-wrapper">
                <button
                  className="icon-btn"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  👤
                </button>

                {showMenu && (
                  <div className="user-dropdown">
                    <Link to="/profile">Thông tin cá nhân</Link>
                    <Link to="/orders">Lịch sử mua hàng</Link>
                    <button onClick={handleLogout}>Đăng xuất</button>
                  </div>
                )}
              </div>

              {/* CART */}
              <Link to="/cart" className="icon-btn">
                🛒
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;
