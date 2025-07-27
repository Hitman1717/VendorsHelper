const express = require("express");
const router = express.Router();

const {
  getSupplierProfile,
  updateSupplierProfile,
  listSuppliers,
} = require("../controllers/supplierController");

const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getSupplierProfile);    // Protected
router.put("/me", protect, updateSupplierProfile); // Protected
router.get("/", listSuppliers);                    // Public

module.exports = router;