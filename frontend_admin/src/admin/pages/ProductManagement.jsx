import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/productManagement.css";
import ProductCreate from "./ProductCreate";
import ProductEdit from "./ProductEdit";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:8000/api/products";
const PRODUCT_IMAGE_URL = "http://localhost:3002";

const ProductManagement = () => {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("list"); // list | create | edit
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Lỗi lấy sản phẩm", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      await axios.delete(`${API_URL}/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Xóa sản phẩm thất bại");
    }
  };

  /* ================= CREATE ================= */
  if (mode === "create") {
    return (
      <ProductCreate
        onBack={() => {
          setMode("list");
          fetchProducts();
        }}
      />
    );
  }

  /* ================= EDIT ================= */
  if (mode === "edit") {
    return (
      <ProductEdit
        product={selectedProduct}
        onBack={() => {
          setMode("list");
          fetchProducts();
        }}
      />
    );
  }

  /* ================= LIST ================= */
  return (
    <div className="product-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div>
          <h2>Quản lý sản phẩm</h2>
          <p>Danh sách sản phẩm trong hệ thống</p>
        </div>

        <div className="page-actions">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-add" onClick={() => setMode("create")}>
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {products
            .filter((p) =>
              p.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((p) => (
              <tr key={p._id}>
                <td>
                  <img
                    src={
                      p.images?.length
                        ? `${PRODUCT_IMAGE_URL}${p.images[0]}`
                        : "https://via.placeholder.com/120x160"
                    }
                    alt={p.name}
                  />
                </td>

                <td>{p.name}</td>
                <td>{p.category?.name || "—"}</td>
                <td>{p.price.toLocaleString("vi-VN")} ₫</td>

                <td className="action-icons">
                  {/* ✏️ EDIT */}
                  <FaEdit
                    className="action-icon edit"
                    title="Sửa sản phẩm"
                    onClick={() => {
                      setSelectedProduct(p);
                      setMode("edit");
                    }}
                  />

                  {/* 🗑 DELETE */}
                  <FaTrash
                    className="action-icon delete"
                    title="Xóa sản phẩm"
                    onClick={() => handleDelete(p._id)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
