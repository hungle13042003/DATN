import Product from "../models/Product.js";
import Category from "../models/Category.js";

/* ================= USER ================= */

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  const products = await Product.find()
    .populate("category")
    .sort({ createdAt: -1 });

  res.json(products);
};

// Lấy chi tiết sản phẩm
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product)
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

  res.json(product);
};

// Tìm kiếm
export const searchProducts = async (req, res) => {
  const keyword = req.query.keyword || "";

  const products = await Product.find({
    name: { $regex: keyword, $options: "i" },
  }).populate("category");

  res.json(products);
};

// Lọc theo danh mục
export const getProductsByCategory = async (req, res) => {
  const products = await Product.find({
    category: req.params.categoryId,
  }).populate("category");

  res.json(products);
};

// Lấy danh mục
export const getAllCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

// Lấy sản phẩm bán chạy
export const getBestSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true })
      .populate("category")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy sản phẩm bán chạy" });
  }
};



/* ================= ADMIN ================= */

// Thêm danh mục
export const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

// Cập nhật danh mục
export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!category)
    return res.status(404).json({ message: "Không tìm thấy danh mục" });

  res.json(category);
};

// Xóa danh mục
export const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category)
    return res.status(404).json({ message: "Không tìm thấy danh mục" });

  res.json({ message: "Xóa danh mục thành công" });
};

// Thêm sản phẩm
export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!product)
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

  res.json(product);
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product)
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

  res.json({ message: "Xóa sản phẩm thành công" });
};

// Cập nhật tồn kho
export const updateStock = async (req, res) => {
  const { quantity } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { quantity },
    { new: true }
  );

  if (!product)
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

  res.json(product);
};
