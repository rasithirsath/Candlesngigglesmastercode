const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

mongoose.connect(
  "mongodb+srv://admin:strongpassword123@cluster0.oehtep7.mongodb.net/?appName=Cluster0",
);

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "candlesngiggles@gmail.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin created");

  process.exit();
}

createAdmin();
