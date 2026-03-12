const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = express.Router();

/* ======================
   SIGNUP
====================== */
router.post("/signup", async (req, res) => {
  console.log("🔥 SIGNUP ROUTE HIT");
  console.log("📩 Request body:", req.body);

  const { name, email, password } = req.body;

  try {
    console.log("🔍 SIGNUP REQUEST EMAIL:", email);
    console.log("📦 DB NAME:", mongoose.connection.name);
    console.log("📂 COLLECTION:", User.collection.name);

    const existingUser = await User.findOne({ email });
    console.log("👤 Existing user:", existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("✅ USER CREATED:", user.email);
    console.log("🎁 Reward Points:", user.rewardPoints);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // ⭐ ADD THIS
        rewardPoints: user.rewardPoints,
      },
    });
  } catch (err) {
    console.error("❌ SIGNUP ERROR FULL:", err);
    res.status(500).json({
      message: "Signup failed",
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  console.log("🔥 LOGIN ROUTE HIT");
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // ⭐ ADD THIS
        rewardPoints: user.rewardPoints,
      },
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
});
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
