import axios from "axios";
import Cart from "../models/Cart.js";

const PRODUCT_SERVICE_URL = "http://product_service:3002/api/by-ids";
// hoặc http://localhost:8001 nếu chạy local

export const getCartDetail = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json([]);
    }

    const productIds = cart.items.map(item => item.productId.toString());
    console.log("test" + productIds);
    // GỌI PRODUCT SERVICE
    const { data: products } = await axios.post(
      PRODUCT_SERVICE_URL,
      { ids: productIds }
    );

    console.log("test" + products);
    // GỘP quantity
    const result = products.data.map(product => {
      const item = cart.items.find(
        i => i.productId.toString() === product._id
      );

      return {
        ...product,
        quantity: item.quantity,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("getCartDetail error:", error.message);
    res.status(500).json({ message: "Lỗi lấy chi tiết giỏ hàng" });
  }
};


// ===============================
// 1. Lấy giỏ hàng của user
// ===============================
export const getCart = async (req, res) => {
  try {
    console.log("test:" + req.user.id);
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate("items.productId");

    return res.json(cart || { items: [] });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// ===============================
// 2. Thêm sản phẩm vào giỏ
// ===============================
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // tạo giỏ mới
      cart = await Cart.create({
        userId: req.user.id,
        items: [{ productId, quantity }]
      });

      return res.json(cart);
    }

    // nếu đã có → tăng số lượng
    const existingItem = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// ===============================
// 3. Cập nhật số lượng
// ===============================
export const updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(item => item.productId.toString() === productId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;

    await cart.save();
    res.json(cart);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// ===============================
// 4. Xóa 1 sản phẩm khỏi giỏ
// ===============================
export const removeItem = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// ===============================
// 5. Xóa toàn bộ giỏ
// ===============================
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
