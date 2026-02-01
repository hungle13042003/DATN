import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/home.css";

const API_BASE = `${process.env.REACT_APP_API_BASE_URL}/api/products`;

/* ===== MAP CATEGORY NAME -> IMAGE ===== */
const categoryImages = {
  "Áo Hoodie": "/assets/categories/aohoodie.png",
  "Áo Sweater": "/assets/categories/aosweater.png",
  "Áo Thun": "/assets/categories/aothun.png",
  "Áo Khoác": "/assets/categories/aokhoac.png",
  "Áo Sơ Mi": "/assets/categories/aosomi.png",
  "Áo Dài": "/assets/categories/aodai.png",
  "Đồng Hồ Nam": "/assets/categories/donghonam.png",
  "Đồng Hồ Nữ": "/assets/categories/donghonu.png",
  "Giày Thể Thao": "/assets/categories/giay.png",
  "Quần Âu": "/assets/categories/quanau.png",
  "Quần Jean": "/assets/categories/quanjean.png",
  "Quần Thể Thao": "/assets/categories/quanthethao.png",
};

function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);

  /* ===== FETCH CATEGORIES ===== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE}/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Lỗi load categories", err);
      }
    };
    fetchCategories();
  }, []);

  /* ===== FETCH BEST SELLER ===== */
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/best-seller`);
        setBestSellers(res.data);
      } catch (err) {
        console.warn("Không có best-seller → fallback");
        const res = await axios.get(`${API_BASE}`);
        setBestSellers(res.data.slice(0, 8));
      }
    };
    fetchBestSellers();
  }, []);

  /* ===== FETCH ALL PRODUCTS ===== */
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products`);
        setPopularProducts(res.data);
      } catch (err) {
        console.error("Lỗi load sản phẩm", err);
      }
    };
    fetchPopularProducts();
  }, []);

  return (
    <>
      <Header />

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-sub">XU HƯỚNG MỚI NHẤT</p>
          <h1>
            Bộ Sưu Tập <span>Thời Trang Hiện Đại</span>
          </h1>
          <p className="hero-desc">
            Phong cách trẻ trung – Tự tin mỗi ngày
          </p>
          <button className="hero-btn">Mua ngay</button>
        </div>
      </section>

      {/* ===== DANH MỤC ===== */}
      <section className="section">
        <h2 className="section-title left">Danh mục nổi bật</h2>

        <div className="category-scroll">
          {categories.map((cat) => (
            <div key={cat._id} className="category-card">
              <img
                src={categoryImages[cat.name] || "/assets/categories/default.png"}
                alt={cat.name}
                onError={(e) =>
                  (e.target.src = "/assets/categories/default.png")
                }
              />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BEST SELLER ===== */}
      <section className="section light">
        <h2 className="section-title">🔥 Sản phẩm bán chạy</h2>

        <div className="product-scroll">
          {bestSellers.map((p) => (
            <div key={p._id} className="product-card-vertical">
              <img
                src={
                  p.images?.length
                    ? `http://localhost:3002${p.images[0]}`
                    : "https://via.placeholder.com/300x400"
                }
                alt={p.name}
              />

              <div className="product-info">
                <h3>{p.name}</h3>
                <p className="price">{p.price?.toLocaleString("vi-VN")}đ</p>

                <button
                  className="detail-btn"
                  onClick={() => navigate(`/products/${p._id}`)}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== POPULAR ===== */}
      <section className="section">
        <h2 className="section-title">⭐ Sản phẩm được ưa chuộng</h2>

        <div className="popular-grid">
          {(showAll ? popularProducts : popularProducts.slice(0, 8)).map((p) => (
            <div key={p._id} className="product-card-grid">
              <img
                src={
                  p.images?.length
                    ? `http://localhost:3002${p.images[0]}`
                    : "https://via.placeholder.com/300x400"
                }
                alt={p.name}
              />

              <div className="product-info">
                <h3>{p.name}</h3>
                <p className="price">{p.price?.toLocaleString("vi-VN")}đ</p>

                <button
                  className="detail-btn"
                  onClick={() => navigate(`/products/${p._id}`)}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>

        {popularProducts.length > 8 && (
          <div className="view-more-wrapper">
            <button
              className="view-more-btn"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Thu gọn" : "Xem thêm"}
            </button>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Home;
