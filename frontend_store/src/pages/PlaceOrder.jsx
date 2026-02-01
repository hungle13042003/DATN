import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/placeOrder.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

/* ===============================
   API CONFIG
=============================== */
const API_CART = "http://localhost:8000/api/carts/test";
const API_PROMO = "http://localhost:8000/api/promotions/apply/voucher";
const API_ORDER = "http://localhost:8000/api/orders/orders";
const API_VNPAY = "http://localhost:8000/api/payments/create";

const STORE_ID = process.env.REACT_APP_STORE_ID;

const PlaceOrder = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  /* ===== SHIPPING INFO ===== */
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  /* ===== PROMO ===== */
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  /* ===== OPTIONS ===== */
  const [shippingMethod, setShippingMethod] = useState("STANDARD");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const shippingFee = shippingMethod === "EXPRESS" ? 50000 : 30000;

  /* ===============================
     FETCH CART
  =============================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await axios.get(API_CART, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-store-id": STORE_ID,
          },
        });
        setCartItems(res.data || []);
      } catch (err) {
        console.error(err);
        alert("Không thể tải giỏ hàng");
      }
    };

    fetchCart();
  }, [navigate]);

  /* ===============================
     TÍNH TIỀN
  =============================== */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + shippingFee - discount;

  /* ===============================
     ÁP DỤNG VOUCHER
  =============================== */
  const applyPromo = async () => {
    try {
      const res = await axios.post(API_PROMO, {
        code: promoCode,
        orderValue: subtotal,
      });

      setDiscount(res.data.discountAmount || 0);
      alert(`Giảm ${res.data.discountAmount.toLocaleString()}đ`);
    } catch {
      alert("Mã giảm giá không hợp lệ");
      setDiscount(0);
    }
  };

  /* ===============================
     ĐẶT HÀNG
  =============================== */
  const placeOrder = async () => {
    const token = localStorage.getItem("token");

    if (!cartItems.length) return alert("Giỏ hàng trống");
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address)
      return alert("Vui lòng nhập đầy đủ thông tin giao hàng");

    const orderData = {
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        images: item.images,
      })),

      shippingInfo,
      voucherCode: promoCode || null,
      paymentMethod,               // COD | VNPAY
      shippingMethod,
      totalAmount: subtotal + shippingFee,
      discountAmount: discount,
      finalAmount: total,
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      "x-store-id": STORE_ID,
    };

    try {
      /* ==========================
         VNPAY
      ========================== */
      if (paymentMethod === "VNPAY") {
        // 1️⃣ Tạo order trước
        const orderRes = await axios.post(API_ORDER, orderData, { headers });

        console.log("ORDER RESPONSE:", orderRes.data);

        // 2️⃣ LẤY ORDER ID ĐÚNG
        const orderId = orderRes.data?.data?._id;

        if (!orderId) {
          alert("❌ Backend không trả orderId");
          return;
        }

        // 3️⃣ GỌI VNPAY
        const payRes = await axios.post(
          API_VNPAY,
          {
            orderId,
            amount: total,
          },
          { headers }
        );

        window.location.href = payRes.data.paymentUrl;
        return;
      }

      /* ==========================
         COD
      ========================== */
      await axios.post(API_ORDER, orderData, { headers });

      alert("✅ Đặt hàng thành công!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Đặt hàng thất bại");
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <>
      <Header />

      <div className="placeorder">
        <div className="container">
          <h1 className="page-title">Thanh toán</h1>

          <div className="checkout">
            {/* LEFT */}
            <div className="checkout-left">
              <div className="box">
                <h2>1. Thông tin giao hàng</h2>
                <div className="form-grid">
                  <input
                    placeholder="Họ và tên"
                    value={shippingInfo.fullName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        fullName: e.target.value,
                      })
                    }
                  />
                  <input
                    placeholder="Số điện thoại"
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        phone: e.target.value,
                      })
                    }
                  />
                  <input
                    className="full"
                    placeholder="Địa chỉ giao hàng"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="box">
                <h2>2. Vận chuyển</h2>
                <label className={`option ${shippingMethod === "STANDARD" ? "active" : ""}`}>
                  <input
                    type="radio"
                    checked={shippingMethod === "STANDARD"}
                    onChange={() => setShippingMethod("STANDARD")}
                  />
                  Giao hàng tiêu chuẩn (30.000đ)
                </label>

                <label className={`option ${shippingMethod === "EXPRESS" ? "active" : ""}`}>
                  <input
                    type="radio"
                    checked={shippingMethod === "EXPRESS"}
                    onChange={() => setShippingMethod("EXPRESS")}
                  />
                  Giao hàng hỏa tốc (50.000đ)
                </label>
              </div>

              <div className="box">
                <h2>3. Thanh toán</h2>
                {["COD", "VNPAY"].map((m) => (
                  <label key={m} className={`option ${paymentMethod === m ? "active" : ""}`}>
                    <input
                      type="radio"
                      checked={paymentMethod === m}
                      onChange={() => setPaymentMethod(m)}
                    />
                    {m === "COD"
                      ? "Thanh toán khi nhận hàng"
                      : "Thanh toán qua VNPay"}
                  </label>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="checkout-right">
              <h2>Đơn hàng</h2>

              <div className="order-list">
                {cartItems.map((item, index) => (
                  <div className="order-item" key={index}>
                    <img
                      src={
                        item.images?.length
                          ? `http://localhost:3002${item.images[0]}`
                          : "https://via.placeholder.com/120"
                      }
                      alt={item.name}
                    />
                    <div>
                      <h4>{item.name}</h4>
                      <p>
                        Size: {item.size} | Màu: {item.color}
                      </p>
                      <span>{item.price.toLocaleString()}đ</span>
                    </div>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="promo-box">
                <input
                  placeholder="Mã giảm giá"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={applyPromo}>Áp dụng</button>
              </div>

              <div className="summary">
                <div>
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>
                <div>
                  <span>Vận chuyển</span>
                  <span>{shippingFee.toLocaleString()}đ</span>
                </div>
                {discount > 0 && (
                  <div>
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString()}đ</span>
                  </div>
                )}
                <div className="total">
                  <span>Tổng</span>
                  <span>{total.toLocaleString()}đ</span>
                </div>
              </div>

              <button className="order-btn" onClick={placeOrder}>
                Hoàn tất đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PlaceOrder;
