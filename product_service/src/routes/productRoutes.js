import express from "express";
import {
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getBestSellerProducts,
} from "../controllers/productController.js";

import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ===== USER ===== */
router.get("/products", getAllProducts);
router.get("/products/search", searchProducts);
// 👉 SẢN PHẨM BÁN CHẠY
router.get("/bestseller", getBestSellerProducts);
router.get("/products/:id", getProductById);
router.get("/products/category/:categoryId", getProductsByCategory);
router.get("/categories", getAllCategories);



/* ===== ADMIN ===== */
router.post("/admin/categories", verifyToken, isAdmin, createCategory);
router.put("/admin/categories/:id", verifyToken, isAdmin, updateCategory);
router.delete("/admin/categories/:id", verifyToken, isAdmin, deleteCategory);

router.post("/admin/products", verifyToken, isAdmin, createProduct);
router.put("/admin/products/:id", verifyToken, isAdmin, updateProduct);
router.delete("/admin/products/:id", verifyToken, isAdmin, deleteProduct);
router.put("/admin/products/:id/stock", verifyToken, isAdmin, updateStock);

export default router;
