import express from "express";
import {
  getAllProducts,
  getProductDetail,
  getBestSellerProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByIds,
  searchProducts,
  getAllCategoriesAdmin,
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin
} from "../controllers/productController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { uploadProductImages } from "../middlewares/uploadProductImage.js";

const router = express.Router();

/* PUBLIC */
router.get("/products", getAllProducts);
router.get("/products/best-seller", getBestSellerProducts);
router.get("/products/:id", getProductDetail);
router.get("/categories", getCategories);
router.get("/search", searchProducts);
/* INTERNAL */
router.post("/by-ids", getProductsByIds);

/* ADMIN */
router.post("/admin/products", verifyToken, adminMiddleware, createProduct);
router.put("/admin/products/:id", verifyToken, adminMiddleware, updateProduct);
router.delete("/admin/products/:id", verifyToken, adminMiddleware, deleteProduct);

router.post(
  "/admin/products/upload",
  verifyToken,
  adminMiddleware,
  uploadProductImages,
  (req, res) => {
    const images = req.files.map(
      (file) => `/uploads/products/${file.filename}`
    );

    res.json(images);
  }
);

/* =========================
   ADMIN CATEGORY
========================= */
router.get(
  "/admin/categories",
  verifyToken,
  adminMiddleware,
  getAllCategoriesAdmin
);

router.post(
  "/admin/categories",
  verifyToken,
  adminMiddleware,
  createCategoryAdmin
);

router.put(
  "/admin/categories/:id",
  verifyToken,
  adminMiddleware,
  updateCategoryAdmin
);

router.delete(
  "/admin/categories/:id",
  verifyToken,
  adminMiddleware,
  deleteCategoryAdmin
);


export default router;
