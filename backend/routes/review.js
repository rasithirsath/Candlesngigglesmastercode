const router = require("express").Router();
const auth = require("../middleware/auth");

const Review = require("../models/review");
const User = require("../models/user");
const Order = require("../models/order");

/* ==========================
POST REVIEW
========================== */

router.post("/add", auth, async (req, res) => {
  const { productId, rating, title, comment } = req.body;

  const userId = req.user.id;

  const existing = await Review.findOne({
    userId,
    productId,
  });

  if (existing) {
    return res.status(400).json({
      message: "You already reviewed this product",
    });
  }

  // check verified purchase
  const order = await Order.findOne({
    "items.id": productId,
    "customer.email": req.user.email,
  });

  const review = await Review.create({
    userId,
    productId,
    rating,
    title,
    comment,
    verifiedPurchase: !!order,
  });

  // reward sparks
  const sparksReward = 500;

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { rewardPoints: sparksReward } },
    { new: true },
  );

  res.json({
    success: true,
    review,
    reward: sparksReward,
    user,
  });
});

/* ==========================
GET REVIEWS
========================== */
router.get("/my", auth, async (req, res) => {
  const reviews = await Review.find({ userId: req.user.id })
    .populate("productId")
    .sort({ createdAt: -1 });

  res.json(reviews);
});
router.get("/:productId", async (req, res) => {
  const reviews = await Review.find({
    productId: req.params.productId,
  })
    .populate("userId", "name")
    .sort({ createdAt: -1 });

  res.json(reviews);
});

module.exports = router;
