import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Đăng ký
export const register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address
  });

  res.json(user);
};

// ✅ Đăng nhập
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
};

// ✅ Lấy danh sách user (Admin)
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// ✅ Xoá user (Admin)
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Xoá thành công" });
};

// ✅ LẤY THÔNG TIN NGƯỜI DÙNG (USER + ADMIN)
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// ✅ USER CẬP NHẬT THÔNG TIN CÁ NHÂN
export const updateProfile = async (req, res) => {
  const { name, phone, address, password } = req.body;

  const updateData = { name, phone, address };

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateData.password = hashedPassword;
  }

  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true
  }).select("-password");

  res.json(user);
};

// ✅ ADMIN CẬP NHẬT USER + ĐỔI QUYỀN (user <-> admin)
export const adminUpdateUser = async (req, res) => {
  const { name, phone, address, role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, phone, address, role },
    { new: true }
  ).select("-password");

  res.json(user);
};


// ================== ADDRESS BOOK ==================

// ✅ LẤY DANH SÁCH ĐỊA CHỈ
export const getAddresses = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.addresses || []);
};

// ✅ THÊM ĐỊA CHỈ
export const addAddress = async (req, res) => {
  const { fullName, phone, address, isDefault } = req.body;

  const user = await User.findById(req.user.id);

  // nếu đặt mặc định → bỏ mặc định cũ
  if (isDefault) {
    user.addresses.forEach(a => a.isDefault = false);
    user.address = address; // cập nhật địa chỉ hiển thị nhanh
  }

  user.addresses.push({
    fullName,
    phone,
    address,
    isDefault
  });

  await user.save();
  res.json(user.addresses);
};

// ✅ XOÁ ĐỊA CHỈ
export const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user.id);

  user.addresses = user.addresses.filter(
    a => a._id.toString() !== req.params.id
  );

  await user.save();
  res.json(user.addresses);
};

// ✅ ĐẶT ĐỊA CHỈ MẶC ĐỊNH
export const setDefaultAddress = async (req, res) => {
  const user = await User.findById(req.user.id);

  user.addresses.forEach(a => {
    a.isDefault = a._id.toString() === req.params.id;
    if (a.isDefault) {
      user.address = a.address;
    }
  });

  await user.save();
  res.json(user.addresses);
};
