const router = require("express").Router();
const Product = require("../models/product");
const adminAuth = require("../middleware/adminAuth");

// Public: get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 });
    res.json(products);
  } catch (error) {
    console.error("GET /products failed:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Public: get product by catalog id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("GET /products/:id failed:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// Admin: create product
router.post("/", adminAuth, async (req, res) => {
  try {
    const existing = await Product.findOne({ id: req.body.id });
    if (existing) {
      return res.status(400).json({ message: "Product ID already exists" });
    }
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("POST /products failed:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
});

// Admin: update full product
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("PUT /products/:id failed:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// Admin: delete product
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("DELETE /products/:id failed:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// Admin: patch stock only
router.patch("/:id/stock", adminAuth, async (req, res) => {
  try {
    const stock = Number(req.body.stock);
    if (Number.isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: "Invalid stock value" });
    }

    const updated = await Product.findOneAndUpdate(
      { id: req.params.id },
      { stock },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("PATCH /products/:id/stock failed:", error);
    res.status(500).json({ message: "Failed to update stock" });
  }
});

module.exports = router;
