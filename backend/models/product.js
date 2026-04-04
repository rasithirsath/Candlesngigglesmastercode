const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    mood: {
      type: String,
      enum: ["happy", "sad", "romantic", "angry"],
      required: false,
    },
    collection: {
      type: String,
      enum: ["noor", "zara", "rune", "amara", "viella", "quotes"],
      required: false,
    },
    burnTime: { type: String, required: true },
    isBestSeller: { type: Boolean, default: false },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
