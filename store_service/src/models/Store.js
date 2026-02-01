import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    phone: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Store", storeSchema);
