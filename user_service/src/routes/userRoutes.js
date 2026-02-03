import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  getUsers,
  deactivateUser,
  adminLogin,
  getUserById,
  updateUserByAdmin,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js";

import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* AUTH */
router.post("/auth/register", register);
router.post("/auth/login", login);

router.post("/admin/auth/login", adminLogin);

/* USER */
router.get("/users/me", verifyToken, getProfile);
router.put("/users/me", verifyToken, updateProfile);

/* ADMIN */
router.get("/admin/users", verifyToken, isAdmin, getUsers);
router.put("/admin/users/:id/deactivate", verifyToken, isAdmin, deactivateUser);

router.get(
  "/admin/users/:id",
  verifyToken,
  isAdmin,
  getUserById
);

router.put(
  "/admin/users/:id",
  verifyToken,
  isAdmin,
  updateUserByAdmin
);

router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password/:token", resetPassword);

export default router;
