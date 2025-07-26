const mongoose = require("mongoose");

const GroupBuySchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  productName: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },

  targetQuantity: { type: Number, required: true },
  currentQuantity: { type: Number, default: 0 },
  unit: String,
  pricePerUnit: Number,
  maxPrice: Number,
  deadline: Date,

  participants: [{
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    quantity: Number
  }],

  status: {
    type: String,
    enum: ["open", "confirmed", "cancelled"],
    default: "open"
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GroupBuy", GroupBuySchema);
