const express = require("express");
const router = express.Router();

const {
  registerSupplier,
  getSupplierProfile,
  updateSupplierProfile,
  listSuppliers,
} = require("../controllers/supplierController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerSupplier); // Public
router.get("/me", protect, getSupplierProfile);    // Protected
router.put("/me", protect, updateSupplierProfile); // Protected
router.get("/", listSuppliers);                    // Public

module.exports = router;