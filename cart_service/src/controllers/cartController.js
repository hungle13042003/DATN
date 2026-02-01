import Cart from "../models/Cart.js";
import axios from "axios";

const PRODUCT_SERVICE_URL = "http://product_service:3002/api/by-ids";

/**
 * ===============================
 * ADD TO CART
 * ===============================
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.storeId;
    const { productId, size, color, quantity = 1 } = req.body;

    if (!productId || !size || !color) {
      return res.status(400).json({
        message: "productId, size, color là bắt buộc",
      });
    }

    let cart = await Cart.findOne({ userId, storeId });

    // 🟢 CHƯA CÓ CART → TẠO MỚI
    if (!cart) {
      cart = await Cart.create({
        userId,
        storeId,
        items: [
          {
            productId,
            size,
            color,
            quantity,
          },
        ],
      });
      return res.json(cart);
    }

    // 🟡 ĐÃ CÓ CART → CHECK ITEM
    const itemIndex = cart.items.findIndex(
      (i) =>
        i.productId.toString() === productId &&
        i.size === size &&
        i.color === color
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        size,
        color,
        quantity,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Không thể thêm vào giỏ hàng" });
  }
};

/**
 * ===============================
 * GET CART DETAIL
 * ===============================
 */
export const getCartDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.storeId;

    const cart = await Cart.findOne({ userId, storeId });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json([]);
    }

    const productIds = cart.items.map((item) =>
      item.productId.toString()
    );

    const response = await axios.post(PRODUCT_SERVICE_URL, {
      ids: productIds,
    });

    const products = response.data?.data || [];

    /**
     * 🔥 CART ITEM LÀ GỐC
     */
    const result = cart.items
      .map((item) => {
        const product = products.find(
          (p) => p._id === item.productId.toString()
        );

        if (!product) return null;

        return {
          ...product,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        };
      })
      .filter(Boolean);

    res.json(result);
  } catch (error) {
    console.error("getCartDetail error:", error);
    res.status(500).json({ message: "Lỗi lấy giỏ hàng" });
  }
};

/**
 * ===============================
 * UPDATE CART ITEM
 * ===============================
 */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.storeId;
    const { productId, size, color, quantity } = req.body;

    if (!productId || !size || !color || quantity < 1) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
      });
    }

    const cart = await Cart.findOneAndUpdate(
      {
        userId,
        storeId,
        "items.productId": productId,
        "items.size": size,
        "items.color": color,
      },
      {
        $set: {
          "items.$.quantity": quantity,
        },
      },
      { new: true }
    );

    res.json(cart);
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Không thể cập nhật giỏ hàng" });
  }
};

/**
 * ===============================
 * REMOVE CART ITEM
 * ===============================
 */
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.storeId;
    const { productId, size, color } = req.body;

    if (!productId || !size || !color) {
      return res.status(400).json({
        message: "productId, size, color là bắt buộc",
      });
    }

    const cart = await Cart.findOneAndUpdate(
      { userId, storeId },
      {
        $pull: {
          items: {
            productId,
            size,
            color,
          },
        },
      },
      { new: true }
    );

    res.json(cart);
  } catch (error) {
    console.error("Remove cart item error:", error);
    res.status(500).json({ message: "Không thể xóa sản phẩm" });
  }
};

/**
 * ===============================
 * CLEAR CART
 * ===============================
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.storeId;

    await Cart.findOneAndUpdate(
      { userId, storeId },
      { items: [] }
    );

    res.json({ message: "Đã xóa giỏ hàng" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Không thể xóa giỏ hàng" });
  }
};
