import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/categoryProduct.css";

const API_BASE = "http://localhost:8000/api/products";

/* ===== MAP ROUTE TYPE -> CATEGORY NAMES (DB) ===== */
const CATEGORY_GROUP = {
  ao: [
    "Áo Hoodie",
    "Áo Sweater",
    "Áo Thun",
    "Áo Dài",
    "Áo Sơ Mi",
    "Áo Khoác",
  ],
  quan: [
    "Quần Âu",
    "Quần Jean",
    "Quần Thể Thao",
  ],
  giay: [
    "Giày Thể Thao",
  ],
  phukien: [
    "Đồng Hồ Nam",
    "Đồng Hồ Nữ",
  ],
};

/* ===== MAP TITLE ===== */
const TITLE_MAP = {
  ao: "Áo",
  quan: "Quần",
  giay: "Giày",
  phukien: "Phụ kiện",
};

function CategoryProducts() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);

        // 👉 Lấy tất cả sản phẩm
        const res = await axios.get(`${API_BASE}/products`);

        // 👉 Lọc theo nhóm danh mục
        const filteredProducts = res.data.filter(
          (p) =>
            p.category &&
            CATEGORY_GROUP[type]?.some(
              (cat) => cat.trim() === p.category.name?.trim()
            )
        );

        setProducts(filteredProducts);
      } catch (err) {
        console.error("❌ Lỗi load sản phẩm theo danh mục", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [type]);

  return (
    <>
      <Header />

      <section className="section category-page">
        <h2 className="category-title">
          Danh mục: {TITLE_MAP[type] || ""}
        </h2>

        {loading ? (
          <div className="category-loading">
            Đang tải sản phẩm...
          </div>
        ) : products.length === 0 ? (
          <div className="category-empty">
            Không có sản phẩm nào trong danh mục này.
          </div>
        ) : (
          <div className="category-grid">
            {products.map((p) => (
              <div
                key={p._id}
                className="category-card-product"
              >
                <img
                  src={
                    p.images?.length > 0
                      ? `http://localhost:3002${p.images[0]}`
                      : "https://via.placeholder.com/300x400"
                  }
                  alt={p.name}
                />

                <div className="category-product-info">
                  <h3>{p.name}</h3>

                  <p className="category-product-price">
                    {p.price?.toLocaleString("vi-VN")}đ
                  </p>

                  <button
                    className="category-detail-btn"
                    onClick={() =>
                      navigate(`/products/${p._id}`)
                    }
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default CategoryProducts;
