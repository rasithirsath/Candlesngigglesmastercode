const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    amount: Number,
    currency: { type: String, default: "INR" },

    customer: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },

    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,

        customizations: [
          {
            id: String,
            name: String,
            price: Number,
            message: String,
          },
        ],

        customizationsTotal: Number,
      },
    ],

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "paid",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", OrderSchema);
