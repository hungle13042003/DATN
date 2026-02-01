import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/header.css";

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [showMenu, setShowMenu] = useState(false);
  const [keyword, setKeyword] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && keyword.trim()) {
      navigate(`/search?q=${keyword.trim()}`);
      setKeyword("");
    }
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
          <Link to="/category/phukien">Phụ kiện</Link>
        </nav>

        {/* RIGHT */}
        <div className="header-right">
          <input
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleSearch}
          />

          {!isLoggedIn && (
            <Link to="/login" className="login-btn">
              Đăng nhập
            </Link>
          )}

          {isLoggedIn && (
            <>
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
