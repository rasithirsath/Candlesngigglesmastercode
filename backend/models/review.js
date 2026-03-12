const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    productId: {
      type: String,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: String,

    comment: String,

    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", ReviewSchema);
