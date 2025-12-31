import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

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

    voucherCode: {
      type: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
