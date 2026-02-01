import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
      index: true,
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    size: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * 1 product + 1 store + 1 size = 1 inventory record
 */
inventorySchema.index(
  { productId: 1, storeId: 1, size: 1 },
  { unique: true }
);

export default mongoose.model("Inventory", inventorySchema);
