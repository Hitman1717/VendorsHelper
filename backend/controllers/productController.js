const Product = require("../models/Product");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    if (req.user.role !== "supplier") {
      return res.status(403).json({ message: "Forbidden: Only suppliers can create products." });
    }

    const {
      name,
      pricePerUnit,
      actualPerUnit,
      unit,
      availableQuantity,
      imageUrl,
      videoUrl, // Added videoUrl
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
      videoUrl, // Added videoUrl
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

// Get all products with optional filtering by category
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query; // e.g., /api/products?category=Oil
    const filter = {};

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .populate("supplierId", "name shopName location")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json(products);
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getSupplierProducts = async (req, res) => {
  try {
    // The 'protect' middleware already verifies the user's role and attaches the user's ID.
    // We just need to ensure the role is 'supplier' for this specific action.
    if (req.user.role !== "supplier") {
      return res.status(403).json({ message: "Forbidden: You are not a supplier." });
    }

    // Find all products where the supplierId matches the logged-in user's ID
    const products = await Product.find({ supplierId: req.user.id })
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json(products);

  } catch (err) {
    console.error("Error fetching supplier products:", err);
    res.status(500).json({ message: "Server error while fetching products." });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Authorization check: user must be a supplier and own the product
    if (req.user.role !== "supplier" || product.supplierId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You are not authorized to update this product." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Authorization check: user must be a supplier and own the product
    if (req.user.role !== "supplier" || product.supplierId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You are not authorized to delete this product." });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};