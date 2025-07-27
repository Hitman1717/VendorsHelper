const express = require("express");
const router = express.Router();

// Supplier: get all orders received for their products
const {
  getSupplierProfile,
  updateSupplierProfile,
  listSuppliers,
   getOrdersForSupplier
} = require("../controllers/supplierController");

const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getSupplierProfile);    // Protected
router.put("/me", protect, updateSupplierProfile); // Protected
router.get("/", listSuppliers);                    // Public
router.get("/supplier", protect, getOrdersForSupplier);


module.exports = router;