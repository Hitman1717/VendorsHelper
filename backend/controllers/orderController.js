const Order = require("../models/OrderSchema");
const Product = require("../models/Product");

// @desc    Vendor places a new order
// @route   POST /api/vendors/orders
// @access  Private (Vendor only)
exports.createOrder = async (req, res) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const {
      productId,
      quantity,
      deliveryAddress,
      paymentMethod
    } = req.body;

    const product = await Product.findById(productId).populate("supplierId");
    if (!product) return res.status(404).json({ message: "Product not found" });

    const totalAmount = product.pricePerUnit * quantity;

    const order = await Order.create({
      vendorId: req.user.id,
      supplierId: product.supplierId._id,
      productId: product._id,
      category: product.category,
      quantity,
      unit: product.unit,
      pricePerUnit: product.pricePerUnit,
      totalAmount,
      deliveryAvailable: product.deliveryAvailable,
      deliveryAddress,
      paymentMethod
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

// @desc    Vendor views all their orders
// @route   GET /api/vendors/orders
// @access  Private (Vendor only)
exports.getMyOrders = async (req, res) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const orders = await Order.find({ vendorId: req.user.id })
      .populate("productId", "name")
      .populate("supplierId", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};
