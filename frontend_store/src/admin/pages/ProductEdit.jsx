import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/productManagement.css";

const API_URL = "http://localhost:8000/api/products";
const PRODUCT_IMAGE_URL = "http://localhost:3002";

const ProductEdit = ({ product, onBack }) => {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    images: [],
  });

  // ================= LOAD DATA =================
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        category: product.category?._id || "",
        price: product.price || "",
        quantity: product.quantity || "",
        description: product.description || "",
        images: product.images || [],
      });
    }
  }, [product]);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      await axios.put(
        `${API_URL}/admin/products/${product._id}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Cập nhật thành công");
      onBack();
    } catch (err) {
      console.error(err);
      alert("❌ Cập nhật thất bại");
    }
  };

  return (
    <div className="product-page">
      <h2>✏️ Cập nhật sản phẩm</h2>

      <div className="product-create-grid">
        {/* ================= FORM ================= */}
        <div className="product-form-box">
          <label>Tên sản phẩm</label>
          <input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <label>Giá</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <label>Số lượng</label>
          <input
            type="number"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />

          <label>Mô tả</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        {/* ================= IMAGES ================= */}
        <div className="product-form-box image-form">
          <h4>Hình ảnh hiện tại</h4>

          {form.images.length === 0 && (
            <p style={{ color: "#888" }}>Chưa có hình ảnh</p>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {form.images.map((img, i) => (
              <img
                key={i}
                src={`${PRODUCT_IMAGE_URL}${img}`}
                alt={`Ảnh ${i + 1}`}
                width={90}
                style={{
                  borderRadius: 6,
                  border: "1px solid #eee",
                  objectFit: "cover",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= ACTION ================= */}
      <div className="form-actions">
        <button onClick={handleSubmit}>💾 Cập nhật</button>
        <button onClick={onBack}>↩ Trở về</button>
      </div>
    </div>
  );
};

export default ProductEdit;
