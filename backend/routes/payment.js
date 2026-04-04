const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = require("express").Router();
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const auth = require("../middleware/auth");
const sendMail = require("../utils/sendmail");
const { customerTemplate, adminTemplate } = require("../utils/emailTemplate");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order (requires authentication)
router.post("/create-order", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    console.log("RAZORPAY ORDER CREATED:", order);

    res.json(order);
  } catch (error) {
    console.error("RAZORPAY ORDER ERROR:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

// Verify payment (requires authentication)
router.post("/verify-payment", auth, async (req, res) => {
  console.log("VERIFY PAYMENT API HIT");
  console.log("BODY:", req.body);
  console.log("USER:", req.user);
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    customer,
    items,
    redeemPoints,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false });
  }

  // Validate stock before creating paid order
  for (const item of items || []) {
    const product = await Product.findOne({ id: item.id });

    if (!product) {
      return res.status(400).json({
        success: false,
        message: `Product not found for id ${item.id}`,
      });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `${product.name} is out of stock for requested quantity`,
      });
    }
  }

  // ✅ Save order
  const order = await Order.create({
    user: req.user.id,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    amount,
    customer,
    items,
    status: "paid",
  });
  // Decrement stock for each item after successful order save
  for (const item of items || []) {
    await Product.findOneAndUpdate(
      { id: item.id },
      { $inc: { stock: -item.quantity } },
    );
  }

  console.log(
    "🧾 SAVED ORDER CUSTOMIZATIONS:",
    JSON.stringify(order.items[0].customizations, null, 2),
  );

  // 🎁 Award reward points based on purchase amount (BEFORE sending email)
  let pointsData = null;
  let userEmail = customer.email; // fallback to checkout email if something goes wrong

  try {
    // 🔥 Deduct points if redeemPoints is true
    if (redeemPoints && req.user && req.user.id) {
      console.log(`💎 User requested to redeem 1000 points for ₹500 discount`);
      const user = await User.findById(req.user.id);

      if (!user) {
        console.log(`⚠️ User not found with ID: ${req.user.id}`);
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.rewardPoints < 1000) {
        console.log(
          `⚠️ Insufficient points. User has ${user.rewardPoints}, needs 1000`,
        );
        return res.status(400).json({
          success: false,
          message: "Insufficient reward points",
        });
      }

      // Deduct 1000 points
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { rewardPoints: -1000 },
      });
      console.log(`✅ Deducted 1000 points from user ${user.email}`);
    }

    const pointsEarned = Math.floor(amount);
    console.log(
      ` Points calculation: amount=${amount}, pointsEarned=${pointsEarned}`,
    );
    console.log(`👤 Logged-in user ID: ${req.user.id}`);

    if (pointsEarned > 0 && req.user && req.user.id) {
      const user = await User.findById(req.user.id);

      user.rewardPoints += pointsEarned;

      // Tier upgrade logic
      if (user.rewardPoints >= 10000 && user.tier < 3) {
        user.tier = 3;
      } else if (user.rewardPoints >= 5000 && user.tier < 2) {
        user.tier = 2;
      }

      await user.save();

      const result = user;

      if (result) {
        console.log(` Awarded ${pointsEarned} points to user ${result.email}`);
        console.log(`✅ New point total: ${result.rewardPoints}`);
        // Store points data to send in email
        pointsData = {
          pointsEarned,
          totalPoints: result.rewardPoints,
        };
        // Use logged-in user's email for order confirmation
        userEmail = result.email;
      } else {
        console.log(`⚠️ User not found with ID: ${req.user.id}`);
      }
    } else {
      console.log(
        `⚠️ No points awarded. pointsEarned=${pointsEarned}, userId=${req.user?.id}`,
      );
    }
  } catch (err) {
    console.error("❌ Error awarding points:", err);
  }

  // 📧 Send customer email to LOGGED-IN USER'S email (not checkout form email)
  console.log(`📧 Sending order confirmation to logged-in user: ${userEmail}`);
  try {
    console.log("📧 Sending customer email...");
    await sendMail({
      to: userEmail,
      subject: "Your Candle Order is Confirmed ",
      html: customerTemplate(order, pointsData),
    });

    console.log("📧 Sending admin email...");
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Order Received – Candles & Giggles",
      html: adminTemplate(order),
    });

    console.log("✅ Emails sent successfully");
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
  const updatedUser = await User.findById(req.user.id).select("-password");

  return res.json({
    success: true,
    user: updatedUser,
  });
});

module.exports = router;


