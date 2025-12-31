import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
