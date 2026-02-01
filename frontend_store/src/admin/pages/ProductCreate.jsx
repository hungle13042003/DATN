import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/productManagement.css";

const API_URL = "http://localhost:8000/api/products";

const ProductCreate = ({ onBack }) => {
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });

  /* ===== LOAD CATEGORY ===== */
  useEffect(() => {
    axios.get(`${API_URL}/categories`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  /* ===== IMAGE UPLOAD ===== */
  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const data = new FormData();
    for (let file of files) {
      data.append("images", file);
      setPreviewImages((prev) => [...prev, URL.createObjectURL(file)]);
    }

    const res = await axios.post(
      `${API_URL}/admin/products/upload`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setImages(res.data);
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = async () => {
    await axios.post(
      `${API_URL}/admin/products`,
      { ...form, images },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("✅ Thêm sản phẩm thành công");
    onBack(); // 🔥 QUAY VỀ DANH SÁCH
  };

  return (
    <div className="product-page">
      <h2>➕ Thêm mới sản phẩm</h2>

      <div className="product-create-grid">
        <div className="product-form-box main-form">
          <input
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Giá sản phẩm"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Số lượng trong kho"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />

          <textarea
            placeholder="Mô tả sản phẩm"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <div className="product-form-box image-form">
          <h4>📸 Hình ảnh sản phẩm</h4>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {previewImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Ảnh sản phẩm ${i + 1}`}
                width={70}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button onClick={handleSubmit}>💾 Lưu sản phẩm</button>
        <button onClick={onBack}>↩ Trở về</button>
      </div>
    </div>
  );
};

export default ProductCreate;
