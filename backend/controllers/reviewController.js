const Review = require("../models/Review");

// @desc    Create a new review (vendor only)
exports.createReview = async (req, res) => {
  try {
    const { supplierId, productId, rating, comment, tags } = req.body;

    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Only vendors can leave reviews" });
    }

    if (!supplierId || !rating) {
      return res.status(400).json({ message: "supplierId and rating are required" });
    }

    // Optional: Prevent duplicate review for same vendor/product
    const existing = await Review.findOne({
      vendorId: req.user.id,
      supplierId,
      productId: productId || null,
    });

    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this item" });
    }

    const review = new Review({
      vendorId: req.user.id,
      supplierId,
      productId: productId || undefined,
      rating,
      comment,
      tags,
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get reviews for a specific product
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("vendorId", "name businessName")
      .populate("supplierId", "name");

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching product reviews:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get reviews for a specific supplier
exports.getReviewsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;

    const reviews = await Review.find({ supplierId })
      .populate("vendorId", "name businessName")
      .populate("productId", "name");

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching supplier reviews:", err);
    res.status(500).json({ message: "Server error" });
  }
};
