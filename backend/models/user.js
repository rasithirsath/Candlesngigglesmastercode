const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    rewardPoints: {
      type: Number,
      default: 100,
    },
    tier: {
      type: Number,
      default: 1,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Persist per-user cart and wishlist server-side
    cart: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    wishlist: [
      {
        id: String,
        name: String,
        price: Number,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
