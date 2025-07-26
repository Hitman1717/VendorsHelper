const Product = require("../models/Product");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    if (req.user.role !== "supplier") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const {
      name,
      pricePerUnit,
      actualPerUnit,
      unit,
      availableQuantity,
      imageUrl,
      deliveryAvailable,
      category
    } = req.body;

    const product = new Product({
      supplierId: req.user.id,
      name,
      pricePerUnit,
      actualPerUnit,
      unit,
      availableQuantity,
      imageUrl,
      deliveryAvailable,
      category
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("supplierId", "name shopName location");
    res.json(products);
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.user.role !== "supplier" || product.supplierId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const allowedFields = [
      "name",
      "pricePerUnit",
      "actualPerUnit",
      "unit",
      "availableQuantity",
      "imageUrl",
      "deliveryAvailable",
      "category"
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.user.role !== "supplier" || product.supplierId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
