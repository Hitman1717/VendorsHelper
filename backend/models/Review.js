const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  tags: [String], 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", ReviewSchema);



