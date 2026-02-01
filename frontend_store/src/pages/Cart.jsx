import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/cart.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_CART = "http://localhost:8000/api/carts";
const STORE_ID = process.env.REACT_APP_STORE_ID;

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ===============================
     🔥 LẤY GIỎ HÀNG
  =============================== */
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setItems([]);
        return;
      }

      const res = await axios.get(`${API_CART}/test`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-store-id": STORE_ID,
        },
      });

      setItems(res.data || []);
    } catch (err) {
      console.error("❌ Không lấy được giỏ hàng", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ===============================
     ❌ XÓA 1 SẢN PHẨM (THEO BIẾN THỂ)
  =============================== */
  const removeItem = async (productId, size, color) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_CART}/remove`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-store-id": STORE_ID,
        },
        data: {
          productId,
          size,
          color,
        },
      });

      fetchCart();
    } catch (err) {
      console.error("❌ Lỗi xóa sản phẩm", err);
      alert("Không thể xóa sản phẩm");
    }
  };

  /* ===============================
     💰 TÍNH TỔNG TIỀN
  =============================== */
  const getSubtotal = () =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <>
        <Header />
        <div className="cart-page">Đang tải giỏ hàng...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="cart-page">
        <h1 className="cart-title">
          Giỏ hàng của bạn <span>({items.length} sản phẩm)</span>
        </h1>

        <div className="cart-wrapper">
          <div className="cart-left">
            <div className="cart-header">
              <span>Sản phẩm</span>
              <span>Giá</span>
              <span>Số lượng</span>
              <span>Tổng</span>
            </div>

            {items.length === 0 && (
              <p className="cart-empty">Giỏ hàng trống</p>
            )}

            {items.map((item) => (
              <div
                className="cart-item"
                key={`${item.productId || item._id}-${item.size}-${item.color}`}
              >
                <div className="cart-product">
                  <img
                    src={
                      item.images?.length
                        ? `http://localhost:3002${item.images[0]}`
                        : "https://via.placeholder.com/120x160"
                    }
                    alt={item.name}
                  />

                  <div className="cart-info">
                    <h3>{item.name}</h3>

                    {/* 🔥 SIZE + COLOR */}
                    <p className="variant">
                      Size: <b>{item.size}</b> | Màu: <b>{item.color}</b>
                    </p>

                    <button
                      className="remove-mobile"
                      onClick={() =>
                        removeItem(
                          item.productId || item._id,
                          item.size,
                          item.color
                        )
                      }
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                <div className="cart-price">
                  {item.price.toLocaleString("vi-VN")}đ
                </div>

                <div className="cart-qty">{item.quantity}</div>

                <div className="cart-total">
                  {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                </div>

                <button
                  className="remove-desktop"
                  onClick={() =>
                    removeItem(
                      item.productId || item._id,
                      item.size,
                      item.color
                    )
                  }
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-right">
            <h2>Cộng giỏ hàng</h2>

            <div className="summary-row">
              <span>Tạm tính</span>
              <span>{getSubtotal().toLocaleString("vi-VN")}đ</span>
            </div>

            <div className="summary-total">
              <span>Tổng cộng</span>
              <span>{getSubtotal().toLocaleString("vi-VN")}đ</span>
            </div>

            <button
              className="checkout-btn"
              disabled={items.length === 0}
              onClick={() =>
                navigate("/place-order", { state: { cartItems: items } })
              }
            >
              Tiến hành thanh toán →
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;
