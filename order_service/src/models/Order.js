import mongoose from "mongoose";

/* ================== ORDER ITEM ================== */
const orderItemSchema = new mongoose.Schema(
  {
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,

    size: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    quantity: Number,
    images: [String],
  },
  { _id: false }
);
/* ================== ORDER ================== */
const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    // 👉 STORE LẤY TỪ TOKEN (ObjectId)
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Store",
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    /* ===== SHIPPING ===== */
    shippingInfo: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      note: String,
    },

    voucherCode: String,

    paymentMethod: {
      type: String,
      enum: ["COD", "VNPAY"],
      default: "COD",
    },

    shippingMethod: {
      type: String,
      default: "STANDARD",
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },

    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
