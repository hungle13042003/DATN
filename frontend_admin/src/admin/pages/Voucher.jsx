import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Voucher.css";

const API_VOUCHER = "http://localhost:8000/api/promotions"; 
// ⚠️ nếu bạn đi qua KONG thì đổi thành:
// http://localhost:8000/api/promotions

const emptyForm = {
  code: "",
  discountType: "PERCENT",
  discountValue: "",
  minOrderValue: "",
  startDate: "",
  endDate: "",
};

function Voucher() {
  const [vouchers, setVouchers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create"); // create | view | edit
  const [formData, setFormData] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState(null);

  /* ================= FETCH ================= */
  const fetchVouchers = async () => {
    const res = await axios.get(API_VOUCHER);
    setVouchers(res.data);
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  /* ================= FORM ================= */
  const openCreate = () => {
    setFormData(emptyForm);
    setMode("create");
    setShowForm(true);
  };

  const openView = (v) => {
    setFormData({
      code: v.code,
      discountType: v.discountType,
      discountValue: v.discountValue,
      minOrderValue: v.minOrderValue,
      startDate: v.startDate.slice(0, 10),
      endDate: v.endDate.slice(0, 10),
    });
    setSelectedId(v._id);
    setMode("view");
    setShowForm(true);
  };

  const openEdit = (v) => {
    openView(v);
    setMode("edit");
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData(emptyForm);
    setSelectedId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const payload = {
      ...formData,
      discountValue:
        formData.discountType === "PERCENT"
          ? Number(formData.discountValue)
          : Number(formData.discountValue),
    };

    if (mode === "create") {
      await axios.post(API_VOUCHER, payload);
    }

    if (mode === "edit") {
      await axios.put(`${API_VOUCHER}/${selectedId}`, payload);
    }

    fetchVouchers();
    closeForm();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa voucher này không?")) return;
    await axios.delete(`${API_VOUCHER}/${id}`);
    fetchVouchers();
  };

  /* ================= RENDER ================= */
  return (
    <div className="voucher-page">
      <div className="voucher-header">
        <h2>Quản lý mã ưu đãi</h2>
        <div className="header-actions">
          <input placeholder="Tìm voucher..." />
          <button onClick={openCreate}>+ Tạo mã ưu đãi</button>
        </div>
      </div>

      <div className="voucher-content">
        {/* TABLE */}
        <table className="voucher-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Đơn tối thiểu</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v._id}>
                <td>{v.code}</td>
                <td>
                  {v.discountType === "PERCENT" ? "Giảm %" : "Giảm tiền"}
                </td>
                <td>
                  {v.discountType === "PERCENT"
                    ? `${v.discountValue}%`
                    : `${v.discountValue.toLocaleString()}đ`}
                </td>
                <td>{v.minOrderValue.toLocaleString()}đ</td>
                <td>{v.startDate.slice(0, 10)}</td>
                <td>{v.endDate.slice(0, 10)}</td>
                <td className="actions">
                  <button onClick={() => openView(v)}>👁</button>
                  <button onClick={() => openEdit(v)}>✏</button>
                  <button onClick={() => handleDelete(v._id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FORM */}
        {showForm && (
          <div className="voucher-form">
            <h3>
              {mode === "create"
                ? "Tạo mã ưu đãi"
                : mode === "view"
                ? "Chi tiết voucher"
                : "Cập nhật voucher"}
            </h3>

            <form>
              <div className="form-row full">
                <label>Mã voucher</label>
                <input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
              </div>

              <div className="form-row">
                <label>Loại giảm</label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  disabled={mode === "view"}
                >
                  <option value="PERCENT">Giảm %</option>
                  <option value="FIXED">Giảm tiền</option>
                </select>
              </div>

              <div className="form-row">
                <label>Giá trị</label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
              </div>

              <div className="form-row">
                <label>Đơn tối thiểu</label>
                <input
                  type="number"
                  name="minOrderValue"
                  value={formData.minOrderValue}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
              </div>

              <div className="form-row">
                <label>Ngày bắt đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
              </div>

              <div className="form-row">
                <label>Ngày kết thúc</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
              </div>

              <div className="form-actions">
                {mode !== "view" && (
                  <button type="button" className="save-btn" onClick={handleSubmit}>
                    Lưu
                  </button>
                )}
                <button type="button" className="cancel-btn" onClick={closeForm}>
                  {mode === "view" ? "Đóng" : "Hủy"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Voucher;
