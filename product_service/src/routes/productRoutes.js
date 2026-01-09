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
  getProductsByIds
} from "../controllers/productController.js";

import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

/* ===== USER ===== */
router.get("/products", getAllProducts);
router.get("/products/search", searchProducts);
router.get("/bestseller", getBestSellerProducts);
router.get("/products/:id", getProductById);
router.get("/products/category/:categoryId", getProductsByCategory);
router.get("/categories", getAllCategories);
router.post("/by-ids", getProductsByIds);

/* ===== ADMIN UPLOAD IMAGE ===== */
router.post(
  "/admin/products/upload",
  verifyToken,
  isAdmin,
  upload.array("images", 5),
  (req, res) => {
    const imageUrls = req.files.map(
      file => `http://localhost:3002/uploads/products/${file.filename}`
    );
    res.json(imageUrls);
  }
);

/* ===== ADMIN PRODUCT ===== */
router.post("/admin/products", verifyToken, isAdmin, createProduct);
router.put("/admin/products/:id", verifyToken, isAdmin, updateProduct);
router.delete("/admin/products/:id", verifyToken, isAdmin, deleteProduct);
router.put("/admin/products/:id/stock", verifyToken, isAdmin, updateStock);

/* ===== ADMIN CATEGORY ===== */
router.post("/admin/categories", verifyToken, isAdmin, createCategory);
router.put("/admin/categories/:id", verifyToken, isAdmin, updateCategory);
router.delete("/admin/categories/:id", verifyToken, isAdmin, deleteCategory);

export default router;
