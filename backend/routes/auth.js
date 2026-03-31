import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import maskSensitive from "../utils/sanitize.js";

const router = Router();

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    // Debug: log incoming headers and body to trace 403/400 issues
    console.log("[auth/register] headers:", {
      origin: req.headers.origin,
      host: req.headers.host,
      referer: req.headers.referer,
      contentType: req.headers["content-type"],
      authorization: req.headers.authorization ? "present" : "none",
    });
    console.log("[auth/register] body:", maskSensitive(req.body));
    // Ensure we received JSON body
    if (!req.is("application/json") && Object.keys(req.body || {}).length === 0) {
      return res.status(400).json({ message: "Expected application/json body" });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const user = await User.create({ username, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    console.log("[auth/login] headers:", {
      origin: req.headers.origin,
      host: req.headers.host,
      referer: req.headers.referer,
      contentType: req.headers["content-type"],
      authorization: req.headers.authorization ? "present" : "none",
    });
    console.log("[auth/login] body:", maskSensitive(req.body));
    if (!req.is("application/json") && Object.keys(req.body || {}).length === 0) {
      return res.status(400).json({ message: "Expected application/json body" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me  – get current user from token
router.get("/me", async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(
      header.split(" ")[1],
      process.env.JWT_SECRET
    );
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { id: user._id, username: user.username, email: user.email } });
  } catch {
    res.status(401).json({ message: "Token invalid" });
  }
});

export default router;
