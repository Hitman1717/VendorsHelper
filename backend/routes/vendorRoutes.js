const express = require("express");
const router = express.Router();
const { getVendorProfile, updateVendorProfile, listVendors } = require("../controllers/vendorController");
const { protect } = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders
} = require("../controllers/orderController");

router.get("/me", protect, getVendorProfile);
router.put("/me", protect, updateVendorProfile);
router.get("/", listVendors); // Public listing
router.post("/orders", createOrder);

// Vendor: view all my orders
router.get("/orders", getMyOrders);
module.exports = router;
