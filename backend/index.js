const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/orders");
const adminOrders = require("./routes/adminOrders");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://gilded-glow-experience-main.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Connect DB
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/payment/webhook", require("./routes/webhook"));
app.use("/api/users", require("./routes/user"));
app.use("/api/rewards", require("./routes/rewards"));
app.use("/api/reviews", reviewRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminOrders);
app.use("/api/admin", require("./routes/admin"));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
