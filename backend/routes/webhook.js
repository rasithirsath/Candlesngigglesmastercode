const express = require("express");
const crypto = require("crypto");
const Order = require("../models/order");
const sendMail = require("../utils/sendmail");
const { customerTemplate, adminTemplate } = require("../utils/emailTemplate");

const router = express.Router();
router.post(
  "/razorpay",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("🔥 WEBHOOK HIT");
    console.log("Headers:", req.headers);
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      console.log("EVENT TYPE:", event.event);

      const order = await Order.findOne({
        razorpayPaymentId: payment.id,
      });

      if (order) {
        // ✅ Send customer email
        await sendMail({
          to: order.customer.email,
          subject: "Your Candle Order is Confirmed ",
          html: customerTemplate(order),
        });

        // ✅ Send admin email
        await sendMail({
          to: process.env.MAIL_FROM,
          subject: "New Order Received – Candles & Giggles",
          html: adminTemplate(order),
        });
      }
    }

    res.json({ status: "ok" });
  },
);

module.exports = router;
