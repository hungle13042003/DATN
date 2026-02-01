import Inventory from "../models/Inventory.js";

/**
 * ===============================
 * INIT INVENTORY (ADMIN)
 * ===============================
 * Tạo tồn kho ban đầu cho 1 product + size
 * storeId LẤY TỪ HEADER (attachStore)
 */
export const initInventory = async (req, res) => {
  try {
    const { productId, size, quantity = 0 } = req.body;
    const storeId = req.storeId;

    if (!productId || !size) {
      return res.status(400).json({
        message: "productId và size là bắt buộc",
      });
    }

    const existed = await Inventory.findOne({
      productId,
      storeId,
      size,
    });

    if (existed) {
      return res.status(400).json({
        message: "Inventory cho size này đã tồn tại",
      });
    }

    const inventory = await Inventory.create({
      productId,
      storeId,
      size,
      quantity,
    });

    res.status(201).json(inventory);
  } catch (err) {
    console.error("initInventory error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ===============================
 * GET INVENTORY BY PRODUCT
 * ===============================
 */
export const getInventoryByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const inventories = await Inventory.find({ productId }).lean();
    res.json(inventories);
  } catch (err) {
    console.error("getInventoryByProduct error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ===============================
 * GET INVENTORY BY STORE
 * ===============================
 */
export const getInventoryByStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const inventories = await Inventory.find({ storeId }).lean();
    res.json(inventories);
  } catch (err) {
    console.error("getInventoryByStore error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ===============================
 * DECREASE INVENTORY (CHECKOUT)
 * ===============================
 * Trừ kho theo product + size
 */
export const decreaseInventory = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const storeId = req.storeId;

    if (!productId || !size || quantity <= 0) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
      });
    }

    const inventory = await Inventory.findOneAndUpdate(
      {
        productId,
        storeId,
        size,
        quantity: { $gte: quantity },
      },
      { $inc: { quantity: -quantity } },
      { new: true }
    );

    if (!inventory) {
      return res.status(400).json({
        message: "Không đủ hàng trong kho",
      });
    }

    res.json({
      message: "Trừ kho thành công",
      inventory,
    });
  } catch (err) {
    console.error("decreaseInventory error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ===============================
 * INCREASE INVENTORY (RESTOCK)
 * ===============================
 */
export const increaseInventory = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const storeId = req.storeId;

    if (!productId || !size || quantity <= 0) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
      });
    }

    const inventory = await Inventory.findOneAndUpdate(
      { productId, storeId, size },
      { $inc: { quantity } },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory không tồn tại",
      });
    }

    res.json({
      message: "Cộng kho thành công",
      inventory,
    });
  } catch (err) {
    console.error("increaseInventory error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ===============================
 * INVENTORY SUMMARY (ADMIN)
 * ===============================
 * Tổng tồn kho theo product + size
 */
export const getInventorySummary = async (req, res) => {
  try {
    const summary = await Inventory.aggregate([
      {
        $group: {
          _id: {
            productId: "$productId",
            size: "$size",
          },
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id.productId",
          size: "$_id.size",
          totalQuantity: 1,
        },
      },
    ]);

    res.json(summary);
  } catch (err) {
    console.error("getInventorySummary error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ===============================
 * ADMIN UPDATE INVENTORY
 * ===============================
 */
export const updateInventoryByAdmin = async (req, res) => {
  try {
    const { productId, storeId, size, quantity } = req.body;

    if (!productId || !storeId || !size || quantity < 0) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
      });
    }

    const inventory = await Inventory.findOneAndUpdate(
      { productId, storeId, size },
      { quantity },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory không tồn tại",
      });
    }

    res.json({
      message: "Cập nhật tồn kho thành công",
      inventory,
    });
  } catch (err) {
    console.error("updateInventoryByAdmin error:", err);
    res.status(500).json({ message: err.message });
  }
};
