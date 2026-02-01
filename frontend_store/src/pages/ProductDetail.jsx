import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/productDetail.css";

const PRODUCT_API = `${process.env.REACT_APP_API_BASE_URL}/api/products`;
const CART_API = `${process.env.REACT_APP_API_BASE_URL}/api/carts/add`;
const STORE_ID = process.env.REACT_APP_STORE_ID;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${PRODUCT_API}/products/${id}`);
        setProduct(res.data);

        setSelectedSize(res.data.sizes?.[0] || "");
        setSelectedColor(res.data.colors?.[0] || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vui lòng đăng nhập");
      navigate("/login");
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert("Vui lòng chọn size và màu sắc");
      return;
    }

    try {
      await axios.post(
        CART_API,
        {
          productId: product._id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-store-id": STORE_ID,
          },
        }
      );

      alert("Đã thêm vào giỏ hàng");
    } catch (err) {
      console.error(err);
      alert("Không thể thêm vào giỏ hàng");
    }
  };

  if (!product) return null;

  return (
    <>
      <Header />

      <div className="product-detail">
        <div className="product-images">
          <img
            className="main-image"
            src={
              product.images?.length
                ? `http://localhost:3002${product.images[activeImage]}`
                : "https://via.placeholder.com/400x500"
            }
            alt={product.name}
          />

          <div className="thumbnail-list">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:3002${img}`}
                alt="thumb"
                className={index === activeImage ? "active" : ""}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>
          <p className="price">
            {product.price.toLocaleString("vi-VN")}đ
          </p>

          {product.sizes?.length > 0 && (
            <div className="option">
              <h4>Size</h4>
              <div className="option-list">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={selectedSize === s ? "active" : ""}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="option">
              <h4>Màu sắc</h4>
              <div className="option-list">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    className={selectedColor === c ? "active" : ""}
                    onClick={() => setSelectedColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="quantity">
            <h4>Số lượng</h4>
            <div className="qty-control">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
          </div>

          <button className="add-to-cart" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
