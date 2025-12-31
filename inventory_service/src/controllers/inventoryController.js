import Inventory from "../models/Inventory.js";

// ✅ Lấy tồn kho theo productId
export const getInventoryByProduct = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ productId: req.params.productId });

    if (!inventory) {
      return res.status(404).json({ message: "Không tìm thấy tồn kho sản phẩm" });
    }

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy tồn kho", error: error.message });
  }
};

// ✅ Tạo tồn kho
export const createInventory = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const exists = await Inventory.findOne({ productId });
    if (exists) {
      return res.status(400).json({ message: "Sản phẩm đã có tồn kho" });
    }

    const inventory = await Inventory.create({ productId, quantity });

    res.status(201).json({
      message: "Tạo tồn kho thành công",
      inventory
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo tồn kho", error: error.message });
  }
};

// ✅ Cập nhật tồn kho
export const updateInventory = async (req, res) => {
  try {
    const { quantity } = req.body;

    const inventory = await Inventory.findOneAndUpdate(
      { productId: req.params.productId },
      { quantity },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: "Không tìm thấy tồn kho" });
    }

    res.status(200).json({
      message: "Cập nhật tồn kho thành công",
      inventory
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật tồn kho", error: error.message });
  }
};

// ✅ Trừ tồn kho khi đặt hàng
export const decreaseInventory = async (req, res) => {
  try {
    const { quantity } = req.body;

    const inventory = await Inventory.findOne({ productId: req.params.productId });

    if (!inventory || inventory.quantity < quantity) {
      return res.status(400).json({ message: "Không đủ tồn kho" });
    }

    inventory.quantity -= quantity;
    await inventory.save();

    res.status(200).json({
      message: "Trừ tồn kho thành công",
      inventory
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi trừ tồn kho", error: error.message });
  }
};
