import express from "express";
import {
  register,
  login,
  getUsers,
  deleteUser,
  getProfile,
  updateProfile,
  adminUpdateUser
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

export default router;
