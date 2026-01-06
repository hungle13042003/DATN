import express from "express";
import {
  register,
  login,
  getUsers,
  deleteUser,
  getProfile,
  updateProfile,
  adminUpdateUser,
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress
} from "../controllers/userController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);

// User
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);
router.put("/:id", protect, admin, adminUpdateUser);

// ===== ADDRESS BOOK =====
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.delete("/addresses/:id", protect, deleteAddress);
router.put("/addresses/:id/default", protect, setDefaultAddress);


export default router;
