import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  address: String,
  isDefault: {
    type: Boolean,
    default: false
  }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  phone: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  // địa chỉ mặc định (đang dùng)
  address: String,

  // ✅ SỔ ĐỊA CHỈ
  addresses: [addressSchema]

}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);
