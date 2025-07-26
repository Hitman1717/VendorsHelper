const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsByProduct,
  getReviewsBySupplier
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

// Create a new review (vendor only)
router.post("/", protect, createReview);

// Get reviews for a specific product
router.get("/product/:productId", getReviewsByProduct);

// Get reviews for a specific supplier
router.get("/supplier/:supplierId", getReviewsBySupplier);

module.exports = router;
