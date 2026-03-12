const mongoose = require("mongoose");

const RewardRedemptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    experienceName: String,

    sparksUsed: Number,

    status: {
      type: String,
      default: "redeemed",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RewardRedemption", RewardRedemptionSchema);
