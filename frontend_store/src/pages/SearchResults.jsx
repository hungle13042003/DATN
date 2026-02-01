import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/categoryProduct.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get("q");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!keyword) return;

    const fetchSearchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_BASE}/api/products/search?keyword=${keyword}`
        );

        setProducts(res.data);
      } catch (err) {
        console.error("❌ Lỗi tìm kiếm sản phẩm", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchProducts();
  }, [keyword]);

  return (
    <>
      <Header />

      <section className="section category-page">
        <h2 className="category-title">
          Kết quả tìm kiếm cho: “{keyword}”
        </h2>

        {loading ? (
          <div className="category-loading">
            Đang tìm kiếm sản phẩm...
          </div>
        ) : products.length === 0 ? (
          <div className="category-empty">
            Không tìm thấy sản phẩm phù hợp.
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
                    {p.price?.toLocaleString("vi-VN")} đ
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

export default SearchResults;
