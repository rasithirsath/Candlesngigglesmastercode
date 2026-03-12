const router = require("express").Router();
const Order = require("../models/order");
const User = require("../models/user");

/* =========================
   GET ALL ORDERS
========================= */

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email rewardPoints tier")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* =========================
   GET CUSTOMER DETAILS
========================= */

router.get("/customer/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.find({ user: req.params.id })
      .populate("user", "name email rewardPoints tier")
      .sort({ createdAt: -1 });

    res.json({
      user,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch customer data" });
  }
});

module.exports = router;
