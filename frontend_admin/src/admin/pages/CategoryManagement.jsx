import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/categoryManagement.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const CategoryManagement = () => {
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  /* ================= FETCH ================= */
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/products/admin/categories?keyword=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories(res.data);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  }, [search, token]); // ✅ API_BASE đã bỏ

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async () => {
    if (!form.name) {
      alert("Tên danh mục không được để trống");
      return;
    }

    try {
      if (editing) {
        await axios.put(
          `${API_BASE}/api/products/admin/categories/${editing}`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `${API_BASE}/api/products/admin/categories`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setForm({ name: "", description: "" });
      setEditing(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi thao tác");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa danh mục này?")) return;

    try {
      await axios.delete(
        `${API_BASE}/api/products/admin/categories/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchCategories();
    } catch (err) {
      alert("Không thể xóa danh mục");
    }
  };

  return (
    <div className="category-container">
      <h2>📂 Quản lý danh mục</h2>

      {/* TOOLBAR */}
      <div className="category-toolbar">
        <input
          placeholder="🔍 Tìm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => {
            setEditing(null);
            setForm({ name: "", description: "" });
          }}
        >
          ➕ Tạo danh mục
        </button>
      </div>

      {/* FORM */}
      <div className="category-form">
        <input
          placeholder="Tên danh mục"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button onClick={handleSubmit}>
          {editing ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>

      {/* TABLE */}
      <table className="category-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.description || "-"}</td>
              <td className="actions">
                <button
                  onClick={() => {
                    setEditing(c._id);
                    setForm({
                      name: c.name,
                      description: c.description || "",
                    });
                  }}
                >
                  ✏️
                </button>
                <button onClick={() => handleDelete(c._id)}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}

          {categories.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                Không có danh mục
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManagement;
