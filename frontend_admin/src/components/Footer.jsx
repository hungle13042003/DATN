import "../styles/footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <div className="brand-title">
            <span className="material-symbols-outlined">checkroom</span>
            <span>FASHION STORE</span>
          </div>
          <p>
            Mang đến phong cách thời trang hiện đại, trẻ trung và chất lượng cho
            mọi người. Tự tin thể hiện cá tính cùng chúng tôi.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h4>Liên kết nhanh</h4>
          <ul>
            <li><Link to="/about">Về chúng tôi</Link></li>
            <li><Link to="/blog">Blog thời trang</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
            <li><Link to="/stores">Hệ thống cửa hàng</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-column">
          <h4>Hỗ trợ khách hàng</h4>
          <ul>
            <li><Link to="/guide">Hướng dẫn mua hàng</Link></li>
            <li><Link to="/policy/return">Chính sách đổi trả</Link></li>
            <li><Link to="/policy/warranty">Chính sách bảo hành</Link></li>
            <li><Link to="/size-guide">Hướng dẫn chọn size</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h4>Liên hệ</h4>
          <ul className="footer-contact">
            <li>
              <span className="material-symbols-outlined">location_on</span>
              1 Trần Duy Hưng, Hà Nội
            </li>
            <li>
              <span className="material-symbols-outlined">call</span>
              1900 123 456
            </li>
            <li>
              <span className="material-symbols-outlined">mail</span>
              fashionstore@gmail.com
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © 2024 Fashion Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
