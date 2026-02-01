import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Đăng ký tài khoản
 * Yêu cầu: name, email, phone, password, confirmPassword, storeId
 */
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      storeId
    } = req.body;

    // Validate dữ liệu
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Mật khẩu nhập lại không khớp"
      });
    }

    if (!storeId) {
      return res.status(400).json({
        message: "Thiếu storeId"
      });
    }

    // Kiểm tra email hoặc phone đã tồn tại
    const existedUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existedUser) {
      return res.status(400).json({
        message: "Email hoặc số điện thoại đã tồn tại"
      });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      storeId
    });

    res.status(201).json({
      message: "Đăng ký thành công"
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      message: "Lỗi đăng ký"
    });
  }
};

/**
 * Đăng nhập
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const storeId = req.headers["x-store-id"]; // 🔥 LẤY STORE

    if (!storeId) {
      return res.status(400).json({
        message: "Missing x-store-id header",
      });
    }

    // 🔥 CHECK ĐÚNG STORE
    const user = await User.findOne({
      email,
      storeId,
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "Tài khoản không tồn tại tại cửa hàng này",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Sai mật khẩu",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        storeId: user.storeId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Lỗi đăng nhập" });
  }
};


/**
 * ADMIN LOGIN (KHÔNG storeId)
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({
      email,
      role: { $in: ["admin", "super_admin"] },
      isActive: true,
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Admin login error" });
  }
};

/**
 * Lấy thông tin cá nhân
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User không tồn tại"
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy thông tin cá nhân"
    });
  }
};

/**
 * USER: Cập nhật thông tin cá nhân
 * Cho phép đổi name, phone, email, password
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    // 👉 ĐỔI EMAIL (CÓ KIỂM TRA TRÙNG)
    if (email) {
      const existedEmail = await User.findOne({
        email,
        _id: { $ne: req.user.id },
      });

      if (existedEmail) {
        return res.status(400).json({
          message: "Email đã được sử dụng bởi tài khoản khác",
        });
      }

      updateData.email = email;
    }

    // 👉 ĐỔI PASSWORD
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({
      message: "Lỗi cập nhật thông tin",
    });
  }
};

/**
 * ADMIN: Lấy danh sách user (toàn hệ thống hoặc theo store)
 */
export const getUsers = async (req, res) => {
  try {
    const { storeId } = req.query;

    const filter = { isActive: true };
    if (storeId) filter.storeId = storeId;

    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy danh sách user"
    });
  }
};

/**
 * ADMIN: Vô hiệu hóa user
 */
export const deactivateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      isActive: false
    });

    res.json({
      message: "User đã bị vô hiệu hóa"
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi vô hiệu hóa user"
    });
  }
};

/**
 * ADMIN: Lấy chi tiết user
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy chi tiết user" });
  }
};

/**
 * ADMIN: Cập nhật user
 */
export const updateUserByAdmin = async (req, res) => {
  try {
    const { name, phone, role } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (role) updateData.role = role;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    res.json({
      message: "Cập nhật user thành công",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi cập nhật user",
    });
  }
};


