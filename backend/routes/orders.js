const router = require("express").Router();
const auth = require("../middleware/auth");
const Order = require("../models/order");

router.get("/my", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({
    createdAt: -1,
  });

  res.json(orders);
});

module.exports = router;
