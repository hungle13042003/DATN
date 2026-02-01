import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/productManagement.css";

/* ================= CONFIG ================= */
const PRODUCT_API = "http://localhost:8000/api/products";
const UPLOAD_API = "http://localhost:3002/api";
const PRODUCT_IMAGE_URL = "http://localhost:3002";

/* ================= CONSTANT ================= */
const DEFAULT_SIZES_TEXT = ["S", "M", "L", "XL"];
const DEFAULT_SIZES_NUMBER = ["38", "39", "40", "41", "42", "43"];
const DEFAULT_COLORS = ["Đen", "Trắng", "Đỏ", "Xanh"];

const ProductEdit = ({ product, onBack }) => {
  const token = localStorage.getItem("token");

  const [customSize, setCustomSize] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    images: [],
    sizes: [],
    colors: [],
  });

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price || "",
        description: product.description || "",
        images: product.images || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
      });
    }
  }, [product]);

  /* ================= IMAGE ================= */
  const removeImage = (img) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i !== img),
    }));
  };

  const uploadImages = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const data = new FormData();
    for (let file of files) {
      data.append("images", file);
      setPreviewImages((prev) => [
        ...prev,
        URL.createObjectURL(file),
      ]);
    }

    const res = await axios.post(
      `${UPLOAD_API}/admin/products/upload`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setNewImages(res.data);
  };

  /* ================= SIZE ================= */
  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const addCustomSize = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const values = customSize
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    setForm((prev) => ({
      ...prev,
      sizes: [...new Set([...prev.sizes, ...values])],
    }));

    setCustomSize("");
  };

  /* ================= COLOR ================= */
  const toggleColor = (color) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const addCustomColor = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const values = customColor
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    setForm((prev) => ({
      ...prev,
      colors: [...new Set([...prev.colors, ...values])],
    }));

    setCustomColor("");
  };

  const removeChip = (type, value) => {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].filter((v) => v !== value),
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      await axios.put(
        `${PRODUCT_API}/admin/products/${product._id}`,
        {
          ...form,
          images: [...form.images, ...newImages],
          price: Number(form.price),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Cập nhật sản phẩm thành công");
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
        <div className="product-form-box main-form">
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

          <label>Mô tả</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* ===== SIZE ===== */}
          <div className="option-group">
            <label>Kích thước</label>

            {/* Dòng chữ */}
            <div className="option-list">
              {DEFAULT_SIZES_TEXT.map((s) => (
                <label key={s} className="option-item">
                  <input
                    type="checkbox"
                    checked={form.sizes.includes(s)}
                    onChange={() => toggleSize(s)}
                  />
                  {s}
                </label>
              ))}
            </div>

            {/* Dòng số */}
            <div className="option-list">
              {DEFAULT_SIZES_NUMBER.map((s) => (
                <label
                  key={s}
                  className="option-item number"
                >
                  <input
                    type="checkbox"
                    checked={form.sizes.includes(s)}
                    onChange={() => toggleSize(s)}
                  />
                  {s}
                </label>
              ))}
            </div>

            <input
              placeholder="Size khác (VD: 41,42,FreeSize) → Enter"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              onKeyDown={addCustomSize}
            />

            <div className="chip-list">
              {form.sizes.map((s) => (
                <div key={s} className="chip">
                  {s}
                  <button
                    type="button"
                    onClick={() => removeChip("sizes", s)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ===== COLOR ===== */}
          <div className="option-group">
            <label>Màu sắc</label>

            <div className="option-list">
              {DEFAULT_COLORS.map((c) => (
                <label key={c} className="option-item">
                  <input
                    type="checkbox"
                    checked={form.colors.includes(c)}
                    onChange={() => toggleColor(c)}
                  />
                  {c}
                </label>
              ))}
            </div>

            <input
              placeholder="Màu khác (VD: Be, Xám) → Enter"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              onKeyDown={addCustomColor}
            />

            <div className="chip-list">
              {form.colors.map((c) => (
                <div key={c} className="chip">
                  {c}
                  <button
                    type="button"
                    onClick={() => removeChip("colors", c)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= IMAGE ================= */}
        <div className="product-form-box image-form">
          <h4>📸 Hình ảnh</h4>

          <div className="image-preview">
            {form.images.map((img) => (
              <div key={img} className="image-box">
                <img
                  src={`${PRODUCT_IMAGE_URL}${img}`}
                  alt="Ảnh sản phẩm"
                />
                <button
                  className="remove-img"
                  type="button"
                  onClick={() => removeImage(img)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <input type="file" multiple onChange={uploadImages} />

          <div className="image-preview">
            {previewImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Ảnh xem trước"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= ACTION ================= */}
      <div className="form-actions">
        <button onClick={handleSubmit}>💾 Lưu thay đổi</button>
        <button onClick={onBack}>↩ Trở về</button>
      </div>
    </div>
  );
};

export default ProductEdit;
