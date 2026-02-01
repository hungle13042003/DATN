import Product from "../models/Product.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";
import slugify from "slugify";
/**
 * =========================
 * PUBLIC API
 * =========================
 */

/**
 * Lấy tất cả sản phẩm
 * - tìm kiếm theo tên
 * - lọc theo danh mục
 */
export const getAllProducts = async (req, res) => {
  try {
    const { keyword, category } = req.query;

    const filter = { isActive: true };

    // 🔍 Tìm kiếm theo tên
    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }

    // 📂 Lọc theo danh mục
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách sản phẩm" });
  }
};

/**
 * Lấy chi tiết sản phẩm theo ID
 */
export const getProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm"
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy chi tiết sản phẩm" });
  }
};

/**
 * Lấy sản phẩm bán chạy
 */
export const getBestSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isBestSeller: true,
      isActive: true
    }).populate("category");

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy sản phẩm bán chạy"
    });
  }
};

/**
 * Lấy danh sách danh mục
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy danh mục"
    });
  }
};

/**
 * =========================
 * ADMIN API
 * =========================
 */

/**
 * Thêm sản phẩm mới
 */
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi tạo sản phẩm"
    });
  }
};

/**
 * Cập nhật sản phẩm
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi cập nhật sản phẩm"
    });
  }
};

/**
 * Xóa mềm sản phẩm
 */
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      isActive: false
    });

    res.json({
      message: "Đã xóa sản phẩm"
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi xóa sản phẩm"
    });
  }
};

/**
 * =========================
 * INTERNAL SERVICE API
 * =========================
 */

/**
 * Cart Service gọi
 * Lấy danh sách sản phẩm theo ID
 */
export const getProductsByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Danh sách productId không hợp lệ"
      });
    }

    const products = await Product.find({
      _id: { $in: ids },
      isActive: true
    });

    res.json({
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy sản phẩm theo danh sách ID"
    });
  }
};


/* ===============================
   SEARCH PRODUCTS BY NAME
   =============================== */
export const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.json([]);
    }

    const products = await Product.find({
      name: { $regex: keyword, $options: "i" }, // không phân biệt hoa thường
    })
      .populate("category")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Search product error:", error);
    res.status(500).json({ message: "Lỗi tìm kiếm sản phẩm" });
  }
};

/* =========================
   ADMIN CATEGORY (GỘP)
========================= */

/**
 * Lấy danh sách danh mục (admin + search)
 */
export const getAllCategoriesAdmin = async (req, res) => {
  try {
    const { keyword } = req.query;

    const filter = {};
    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh mục" });
  }
};

/**
 * Tạo danh mục
 */
export const createCategoryAdmin = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Thiếu tên danh mục" });
    }

    // 🔥 TẠO SLUG TỰ ĐỘNG
    let slug = slugify(name, {
      lower: true,
      strict: true,
      locale: "vi",
    });

    // 🔁 ĐẢM BẢO SLUG KHÔNG TRÙNG
    let slugExists = await Category.findOne({ slug });
    let count = 1;

    while (slugExists) {
      slug = `${slug}-${count}`;
      slugExists = await Category.findOne({ slug });
      count++;
    }

    const category = await Category.create({
      name,
      slug,
      description,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi tạo danh mục" });
  }
};

/**
 * Cập nhật danh mục
 */
export const updateCategoryAdmin = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updateData = { description };

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, {
        lower: true,
        strict: true,
        locale: "vi",
      });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật danh mục" });
  }
};

/**
 * Xóa mềm danh mục
 */
export const deleteCategoryAdmin = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });

    res.json({ message: "Đã xóa danh mục" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa danh mục" });
  }
};