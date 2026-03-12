const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    mongoose.connection.once("open", () => {
      console.log("✅ Connected to DB:", mongoose.connection.name);
      console.log("📍 Host:", mongoose.connection.host);
    });
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
