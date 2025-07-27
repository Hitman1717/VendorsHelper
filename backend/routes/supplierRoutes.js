const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// Import all the necessary controller functions
const {
  getSupplierProfile,
  updateSupplierProfile,
  listSuppliers,
  getOrdersForSupplier,
  updateOrderStatus,     // <-- Add this import
  updatePaymentStatus,   // <-- Add this import
} = require("../controllers/supplierController"); // Assuming you placed the new functions here

// --- Supplier Profile Routes ---
router.get("/me", protect, getSupplierProfile);
router.put("/me", protect, updateSupplierProfile);
router.get("/", listSuppliers);

// --- Supplier Order Management Routes ---

// GET all orders for the logged-in supplier
router.get("/orders", protect, getOrdersForSupplier);

// PUT update a specific order's delivery status (e.g., to "shipped" or "delivered")
router.put("/orders/:orderId/status", protect, updateOrderStatus); // <-- New Route

// PUT update a specific order's payment status (e.g., to "successful")
router.put("/orders/:orderId/payment", protect, updatePaymentStatus); // <-- New Route

module.exports = router;