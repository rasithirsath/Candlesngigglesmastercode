const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});
router.put("/profile", auth, async (req, res) => {
  const { name, phone, address } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone, address },
    { new: true },
  ).select("-password");

  res.json(user);
});
// Get current user's cart
router.get("/cart", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("cart");
    res.json({ cart: user?.cart || [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// Save/replace current user's cart
router.post("/cart", auth, async (req, res) => {
  try {
    const { cart } = req.body;
    await User.findByIdAndUpdate(req.user.id, { cart }, { new: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to save cart" });
  }
});

// Get wishlist
router.get("/wishlist", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("wishlist");
    res.json({ wishlist: user?.wishlist || [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
});

// Save/replace wishlist
router.post("/wishlist", auth, async (req, res) => {
  try {
    const { wishlist } = req.body;
    await User.findByIdAndUpdate(req.user.id, { wishlist }, { new: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to save wishlist" });
  }
});

// Deduct reward points
router.post("/deduct-points", auth, async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if ((user.rewardPoints || 0) < points) {
      return res.status(400).json({ message: "Insufficient reward points" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { rewardPoints: -points } },
      { new: true },
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to deduct points" });
  }
});

module.exports = router;
