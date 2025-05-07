import express from "express";
import Users from "../models/users.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/tokenUtils.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const isFirstAccount = (await Users.countDocuments()) === 0;
    const role = isFirstAccount ? "admin" : "user";

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await Users.create({
      email,
      password: hashedPassword,
      username,
      role,
    });
    res.status(201).json({ user, msg: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await Users.findOne({ email });
    const isValidUser =
      user && (await comparePassword(password, user.password));

    if (!isValidUser) throw new Error("Invalid credentials");

    const token = createJWT({ userId: user._id, role: user.role });
    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ msg: "User logged in" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Logout user
router.post("/logout", (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ msg: "User logged out!" });
});

// Verify user authentication
router.get("/verify", authenticateToken, async (req, res) => {
  try {
    const user = await Users.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ role: user.role });
  } catch (err) {
    console.error("Error verifying user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all users
router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await Users.find({}, "username email role");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get("/current-user", authenticateToken, async (req, res) => {
  try {
    const user = await Users.findById(req.user.userId, "username email role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching current user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
