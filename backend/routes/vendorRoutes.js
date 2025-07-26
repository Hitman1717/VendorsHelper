const express = require("express");
const router = express.Router();
const { getVendorProfile, updateVendorProfile, listVendors } = require("../controllers/vendorController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getVendorProfile);
router.put("/me", protect, updateVendorProfile);
router.get("/", listVendors); // Public listing

module.exports = router;
