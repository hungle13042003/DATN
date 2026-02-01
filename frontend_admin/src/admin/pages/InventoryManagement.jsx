import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/inventoryManagement.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem("token");

const STORES = [
  {
    id: "ALL",
    name: "📊 Tổng kho (toàn hệ thống)",
  },
  {
    id: process.env.REACT_APP_STORE_ID_1,
    name: process.env.REACT_APP_STORE_NAME_1,
  },
  {
    id: process.env.REACT_APP_STORE_ID_2,
    name: process.env.REACT_APP_STORE_NAME_2,
  },
];

const InventoryManagement = () => {
  const [storeId, setStoreId] = useState("ALL");
  const [products, setProducts] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState(null);
  const [quantity, setQuantity] = useState("");

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/products/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, []);

  /* ================= FETCH INVENTORY ================= */
  useEffect(() => {
    if (products.length === 0) return;

    const fetchInventory = async () => {
      try {
        // 🔵 TỔNG KHO
        if (storeId === "ALL") {
          const res = await axios.get(
            `${API_BASE}/api/inventory/summary`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const mapped = res.data.map((i) => ({
            ...i,
            product: products.find(
              (p) => p._id === i.productId
            ),
          }));

          setInventories(mapped);
        }
        // 🟢 THEO STORE
        else {
          const res = await axios.get(
            `${API_BASE}/api/inventory/store/${storeId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const mapped = res.data.map((inv) => ({
            ...inv,
            product: products.find(
              (p) => p._id === inv.productId
            ),
          }));

          setInventories(mapped);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchInventory();
  }, [storeId, products]);

  /* ================= UPDATE INVENTORY ================= */
  const handleUpdateInventory = async () => {
    if (!quantity || quantity < 0) return;

    try {
      await axios.put(
        `${API_BASE}/api/inventory/admin/update`,
        {
          productId: editing.productId,
          storeId,
          size: editing.size,
          quantity: Number(quantity),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditing(null);
      setQuantity("");
      setStoreId(storeId);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FILTER ================= */
  const filtered = inventories.filter((i) =>
    i.product?.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="inventory-container">
      <h2>📦 Quản lý tồn kho</h2>

      <div className="inventory-filter">
        <select value={storeId} onChange={(e) => setStoreId(e.target.value)}>
          {STORES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          className="inventory-search"
          placeholder="🔍 Tìm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Size</th>
            <th>Tồn kho</th>
            {storeId !== "ALL" && <th>Hành động</th>}
          </tr>
        </thead>

        <tbody>
          {filtered.map((item, i) => (
            <tr key={i}>
              <td>{item.product?.name}</td>
              <td><b>{item.size}</b></td>
              <td>{item.quantity ?? item.totalQuantity}</td>

              {storeId !== "ALL" && (
                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      setEditing({
                        productId: item.productId,
                        size: item.size,
                      })
                    }
                  >
                    ✏️
                  </button>
                </td>
              )}
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: 20 }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ===== MODAL ===== */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cập nhật tồn kho</h3>

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={handleUpdateInventory}>Lưu</button>
              <button onClick={() => setEditing(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
