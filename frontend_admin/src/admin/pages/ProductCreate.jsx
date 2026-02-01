import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/productManagement.css";

/* ================= CONFIG ================= */
const PRODUCT_API = "http://localhost:8000/api/products"; // qua Kong
const UPLOAD_API = "http://localhost:3002/api"; // upload trực tiếp

const LETTER_SIZES = ["S", "M", "L", "XL"];
const NUMBER_SIZES = ["38", "39", "40", "41", "42", "43"];
const DEFAULT_COLORS = ["Đen", "Trắng", "Đỏ", "Xanh"];

const ProductCreate = ({ onBack }) => {
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [customSize, setCustomSize] = useState("");
  const [customColor, setCustomColor] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    sizes: [],
    colors: [],
  });

  /* ================= LOAD CATEGORY ================= */
  useEffect(() => {
    axios.get(`${PRODUCT_API}/categories`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  /* ================= IMAGE UPLOAD ================= */
  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const data = new FormData();
    for (let file of files) {
      data.append("images", file);
      setPreviewImages((prev) => [...prev, URL.createObjectURL(file)]);
    }

    try {
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

      setImages(res.data); // mảng path ảnh
    } catch (err) {
      console.error(err);
      alert("❌ Upload ảnh thất bại");
    }
  };

  /* ================= TOGGLE SIZE ================= */
  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  /* ================= REMOVE SIZE ================= */
  const removeSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }));
  };

  /* ================= ADD CUSTOM SIZE (MULTI) ================= */
  const addCustomSize = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const values = customSize
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!values.length) return;

    setForm((prev) => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        ...values.filter((v) => !prev.sizes.includes(v)),
      ],
    }));

    setCustomSize("");
  };

  /* ================= TOGGLE COLOR ================= */
  const toggleColor = (color) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  /* ================= REMOVE COLOR ================= */
  const removeColor = (color) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  /* ================= ADD CUSTOM COLOR ================= */
  const addCustomColor = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const values = customColor
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    if (!values.length) return;

    setForm((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        ...values.filter((v) => !prev.colors.includes(v)),
      ],
    }));

    setCustomColor("");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.price) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await axios.post(
        `${PRODUCT_API}/admin/products`,
        {
          ...form,
          price: Number(form.price),
          images,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Thêm sản phẩm thành công");
      onBack();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi tạo sản phẩm");
    }
  };

  return (
    <div className="product-page">
      <h2>➕ Thêm mới sản phẩm</h2>

      <div className="product-create-grid">
        {/* ================= FORM ================= */}
        <div className="product-form-box main-form">
          <input
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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

          <textarea
            placeholder="Mô tả sản phẩm"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* ===== SIZE ===== */}
          <div className="option-group">
            <label>Kích thước</label>

            <div className="option-list">
              {LETTER_SIZES.map((s) => (
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

            <div className="option-list">
              {NUMBER_SIZES.map((s) => (
                <label key={s} className="option-item number">
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
              placeholder="Size khác (VD: 41,42,FreeSize...) → Enter"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              onKeyDown={addCustomSize}
            />

            <div className="chip-list">
              {form.sizes.map((s) => (
                <span key={s} className="chip">
                  {s}
                  <button onClick={() => removeSize(s)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* ===== COLOR ===== */}
          <div className="option-group">
            <label>Màu sắc</label>

            <div className="option-list">
              {DEFAULT_COLORS.map((c) => (
                <label key={c} className="option-item color">
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
              placeholder="Màu khác (VD: Be, Xám...) → Enter"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              onKeyDown={addCustomColor}
            />

            <div className="chip-list">
              {form.colors.map((c) => (
                <span key={c} className="chip">
                  {c}
                  <button onClick={() => removeColor(c)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================= IMAGE ================= */}
        <div className="product-form-box image-form">
          <h4>📸 Hình ảnh sản phẩm</h4>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          <div className="image-preview">
            {previewImages.map((img, i) => (
              <img key={i} src={img} alt={`Ảnh ${i}`} width={80} />
            ))}
          </div>
        </div>
      </div>

      {/* ================= ACTION ================= */}
      <div className="form-actions">
        <button onClick={handleSubmit}>💾 Lưu sản phẩm</button>
        <button onClick={onBack}>↩ Trở về</button>
      </div>
    </div>
  );
};

export default ProductCreate;
