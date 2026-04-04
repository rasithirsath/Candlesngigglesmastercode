require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/product");
const seedProducts = require("./data/seedProductsData");

async function run() {
  try {
    await connectDB();

    // Upsert keeps this script safe to run repeatedly.
    for (const product of seedProducts) {
      const payload = {
        ...product,
        stock:
          typeof product.stock === "number" && product.stock >= 0
            ? product.stock
            : 50,
      };

      await Product.findOneAndUpdate({ id: payload.id }, payload, {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      });
    }

    console.log(`Seeded/updated ${seedProducts.length} products.`);
  } catch (error) {
    console.error("Failed to seed products:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

run();
