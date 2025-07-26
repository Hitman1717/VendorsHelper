const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  name: { type: String, required: true },
  pricePerUnit: { type: Number, required: true },
  actualPerUnit: { type: Number, required: true },
  unit: {
    type: String,
    enum: ["kg", "litre", "piece", "pack"],
    required: true
  },
  availableQuantity: { type: Number, required: true },
  imageUrl: String,
  deliveryAvailable: { type: Boolean, default: true },
  category: String // e.g., Oil, Grain, Spices
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
