import Store from "../models/Store.js";

/* ================= USER ================= */

// Lấy danh sách cửa hàng
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find({ isActive: true }).sort({
      createdAt: -1
    });
    res.json(stores);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy danh sách cửa hàng",
      error: error.message
    });
  }
};

// Lấy chi tiết cửa hàng
export const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: "Không tìm thấy cửa hàng" });
    }

    res.json(store);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy chi tiết cửa hàng",
      error: error.message
    });
  }
};

/* ================= ADMIN ================= */

// Thêm cửa hàng
export const createStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi tạo cửa hàng",
      error: error.message
    });
  }
};

// Cập nhật cửa hàng
export const updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!store) {
      return res.status(404).json({ message: "Không tìm thấy cửa hàng" });
    }

    res.json(store);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi cập nhật cửa hàng",
      error: error.message
    });
  }
};

// Xóa cửa hàng (soft delete)
export const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!store) {
      return res.status(404).json({ message: "Không tìm thấy cửa hàng" });
    }

    res.json({ message: "Đã ngừng hoạt động cửa hàng" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi xóa cửa hàng",
      error: error.message
    });
  }
};
