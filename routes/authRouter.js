import {
  register,
  login,
  logout,
  verify,
  getAllUsers,
  getCurrentUser,
} from "../controller/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("login", login);
router.post("/logout", logout);
router.get("/verify", authenticateToken, verify);
router.get("/users", authenticateToken, getAllUsers);
router.get("/current-user", authenticateToken, getCurrentUser);

export default router;
