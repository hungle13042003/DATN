import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Inventory from "../models/Inventory.js";

dotenv.config();

/* ================= CONFIG ================= */
const STORE_ID = new mongoose.Types.ObjectId(
  "696df15bd6f8e5a5b82a51e6"
);

const PRODUCT_SERVICE_URL =
  "http://product_service:3002/api/products";

const seed = async () => {
  try {
    await connectDB();

    // ❌ Xóa inventory cũ của store
    await Inventory.deleteMany({ storeId: STORE_ID });

    const res = await axios.get(PRODUCT_SERVICE_URL);
    const products = res.data.data || res.data;

    const inventories = [];

    products.forEach((product) => {
      if (!product.sizes || product.sizes.length === 0) return;

      product.sizes.forEach((size) => {
        inventories.push({
          productId: product._id,
          storeId: STORE_ID,
          size: String(size),
          quantity: Math.floor(Math.random() * 30) + 20, // 20–50
        });
      });
    });

    await Inventory.insertMany(inventories);

    console.log("✅ Seed inventory Store 1 theo SIZE thành công");
    process.exit();
  } catch (err) {
    console.error("❌ Seed Store 1 lỗi:", err.message);
    process.exit(1);
  }
};

seed();
