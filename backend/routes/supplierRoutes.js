const express = require("express");
const router = express.Router();
const {
  getSupplierProfile,
  updateSupplierProfile,
  listSuppliers
} = require("../controllers/supplierController");

const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getSupplierProfile);
router.put("/me", protect, updateSupplierProfile);
router.get("/", listSuppliers); // public listing

module.exports = router;
