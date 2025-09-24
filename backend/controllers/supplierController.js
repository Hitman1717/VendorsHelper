const Supplier = require("../models/Supplier");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const mongoose=require("mongoose");
const Product=require("../models/Product");


// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id ,role}, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 2. Get logged-in supplier profile
const getSupplierProfile = async (req, res) => {
  const supplier = await Supplier.findById(req.user.id).select("-passwordHash");
  if (!supplier) return res.status(404).json({ message: "Supplier not found" });

  res.json(supplier);
};

// 3. Update supplier profile
const updateSupplierProfile = async (req, res) => {
  try {
      // req.user.id should be available from your 'protect' middleware
      const supplier = await Supplier.findById(req.user.id);
      if (!supplier) {
          return res.status(404).json({ message: "Supplier not found" });
      }

      const { 
          shopName, 
          ownerName, 
          phone, 
          email, 
          password, 
          address, 
          supplierType, 
          gstNumber, 
          licenseNumber, 
          deliveryOptions, 
          isActive 
      } = req.body;

      const updateData = {};
      if (shopName) updateData.shopName = shopName;
      if (ownerName) updateData.ownerName = ownerName;
      if (address) updateData.address = address;
      if (supplierType) updateData.supplierType = supplierType;
      if (gstNumber) updateData.gstNumber = gstNumber;
      if (licenseNumber) updateData.licenseNumber = licenseNumber;
      if (deliveryOptions) updateData.deliveryOptions = deliveryOptions;
      if (typeof isActive === 'boolean') updateData.isActive = isActive;

      if (email && email !== supplier.email) {
          const existing = await Supplier.findOne({ email });
          if (existing) {
              return res.status(400).json({ message: "This email is already in use." });
          }
          updateData.email = email;
      }

      if (phone && phone !== supplier.phone) {
          const existing = await Supplier.findOne({ phone });
          if (existing) {
              return res.status(400).json({ message: "This phone number is already in use." });
          }
          updateData.phone = phone;
      }

      if (password) {
          const salt = await bcrypt.genSalt(10);
          updateData.passwordHash = await bcrypt.hash(password, salt);
      }

      const updatedSupplier = await Supplier.findByIdAndUpdate(
          req.user.id, 
          { $set: updateData }, 
          { new: true, runValidators: true }
      ).select("-passwordHash");

      res.json(updatedSupplier);
  } catch (error) {
      console.error("Update supplier profile error:", error);
      res.status(500).json({ message: "Server Error" });
  }
};

// 4. Public: List all suppliers
const listSuppliers = async (req, res) => {
  const suppliers = await Supplier.find().select("shopName address rating totalReviews verified");
  res.json(suppliers);
};


// @desc Get all orders received by the logged-in supplier
// @route GET /api/orders/supplier
// @access Private (Supplier only)
const getOrdersForSupplier = async (req, res) => {
  // Ensure the user is a supplier
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const orders = await Order.find({ supplierId: req.user.id })
      .populate("vendorId", "name businessName phone") // Populates vendor info
      .populate("productId", "name unit imageUrl category") // Populates product info
      .sort({ createdAt: -1 }); // Shows newest orders first

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching orders" });
  }
};
// In your orderController.js
const updateOrderStatus = async (req, res) => {
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const session = await mongoose.startSession(); // Use a transaction here!
  session.startTransaction();

  try {
    const { deliveryStatus } = req.body;
    const { orderId } = req.params;

    if (deliveryStatus !== 'shipped' && deliveryStatus !== 'cancelled') {
        return res.status(400).json({ message: "Action not applicable or status invalid" });
    }

    const order = await Order.findById(orderId).session(session);
    if (!order || order.supplierId.toString() !== req.user.id) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Order not found or you are not authorized" });
    }

    // ✅ NEW LOGIC STARTS HERE
    // if (deliveryStatus === 'shipped') {
    //   const product = await Product.findById(order.productId).session(session);

    //   // 1. Check if there is enough stock
    //   if (product.availableQuantity < order.quantity) {
    //     await session.abortTransaction();
    //     session.endSession();
    //     return res.status(400).json({ message: `Not enough stock to ship. Only ${product.availableQuantity}${product.unit} left.` });
    //   }

    //   // 2. If stock is available, deduct it
    //   product.availableQuantity -= order.quantity;
    //   await product.save({ session });
    // }
    // ✅ NEW LOGIC ENDS HERE

    order.deliveryStatus = deliveryStatus;
    await order.save({ session });
    
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error updating order status" });
    console.log(error)
  }
};
// In your orderController.js
const updatePaymentStatus = async (req, res) => {
  // Ensure the user is a supplier
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const { paymentStatus } = req.body;
    const { orderId } = req.params;

    // Check if the provided status is valid
    const allowedStatuses = ["successful", "failed"];
    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status value" });
    }

    // Find the order that belongs to this supplier
    const order = await Order.findOne({
      _id: orderId,
      supplierId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found or you are not authorized" });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({ message: "Payment status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error updating payment status" });
  }
};


module.exports = {
  getSupplierProfile,
  updateSupplierProfile,
  listSuppliers,
  getOrdersForSupplier,updateOrderStatus,updatePaymentStatus
};