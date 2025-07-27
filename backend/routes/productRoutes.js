const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getSupplierProducts
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createProduct); // supplier only
router.get("/", getProducts); // public
router.put("/:id", protect, updateProduct); // supplier only
router.delete("/:id", protect, deleteProduct); // supplier only
router.get("/myproducts",protect,getSupplierProducts);

module.exports = router;