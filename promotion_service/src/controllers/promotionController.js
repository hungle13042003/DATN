import Promotion from "../models/Promotion.js";

/**
 * Tạo voucher
 */
export const createPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.create(req.body);
    res.status(201).json(promotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Lấy tất cả voucher
 */
export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Lấy voucher theo code
 */
export const getPromotionByCode = async (req, res) => {
  try {
    const promotion = await Promotion.findOne({
      code: req.params.code.toUpperCase(),
      isActive: true,
    });

    if (!promotion) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }

    const now = new Date();
    if (now < promotion.startDate || now > promotion.endDate) {
      return res.status(400).json({ message: "Voucher đã hết hạn" });
    }

    res.json(promotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Cập nhật voucher
 */
export const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!promotion) {
      return res.status(404).json({ message: "Không tìm thấy voucher" });
    }

    res.json(promotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Xóa voucher
 */
export const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message: "Không tìm thấy voucher" });
    }

    res.json({ message: "Xóa voucher thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Áp dụng voucher (Order Service gọi)
 */
export const applyPromotion = async (req, res) => {
  const { code, orderValue } = req.body;

  try {
    const promotion = await Promotion.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!promotion) {
      return res.status(404).json({ message: "Voucher không hợp lệ" });
    }

    if (orderValue < promotion.minOrderValue) {
      return res
        .status(400)
        .json({ message: "Không đủ điều kiện áp dụng voucher" });
    }

    let discountAmount = 0;

    if (promotion.discountType === "PERCENT") {
      discountAmount = (orderValue * promotion.discountValue) / 100;
    } else {
      discountAmount = promotion.discountValue;
    }

    res.json({
      discountAmount,
      finalAmount: orderValue - discountAmount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
