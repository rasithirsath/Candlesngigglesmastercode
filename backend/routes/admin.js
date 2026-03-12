const router = require("express").Router();
const Order = require("../models/order");
const User = require("../models/user");

// Admin dashboard stats
router.get("/stats", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
  const users = await User.find();

  const allOrders = await Order.find();

  const revenue = allOrders.reduce((sum, o) => sum + o.amount, 0);

  res.json({
    totalRevenue: revenue,
    totalOrders: allOrders.length,
    totalCustomers: users.length,
    recentOrders: orders,

    chart: [
      { date: "Mon", revenue: 1200 },
      { date: "Tue", revenue: 800 },
      { date: "Wed", revenue: 1500 },
      { date: "Thu", revenue: 600 },
      { date: "Fri", revenue: 2000 },
      { date: "Sat", revenue: 900 },
      { date: "Sun", revenue: 1700 },
    ],
  });
});

module.exports = router;
