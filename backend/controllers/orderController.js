const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose =require("mongoose")

// @desc    Vendor places a new order
// @route   POST /api/vendors/orders
// @access  Private (Vendor only)
exports.createOrder = async (req, res) => {
  // This check uses req.user.role, which your middleware provides.
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Forbidden. Only vendors can create orders." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, quantity, unit, deliveryAddress, paymentMethod } = req.body;

    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Unit Check
    if (product.unit !== unit) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: `Invalid unit. This product is sold by the '${product.unit}'.` });
    }
    
    // ✅ Stock Check (using your 'availableQuantity' field)
    if (product.availableQuantity < quantity) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: `Not enough stock. Only ${product.availableQuantity} available.` });
    }

    const totalAmount = product.pricePerUnit * quantity;

    const orderData = {
      // This uses req.user.id, which your middleware provides.
      vendorId: req.user.id, 
      supplierId: product.supplierId,
      productId: product._id,
      quantity,
      unit,
      pricePerUnit: product.pricePerUnit,
      totalAmount,
      deliveryAvailable: product.deliveryAvailable,
      deliveryAddress,
      paymentMethod,
    };
    
    const [order] = await Order.create([orderData], { session });

    // Decrement the product's available quantity
    product.availableQuantity -= quantity;
    await product.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
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
