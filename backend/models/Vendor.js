const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessName: { type: String },
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },

  location: {
    city: String,
    pincode: String,
    geo: {
      lat: Number,
      lng: Number
    }
  },

  // foodType: String,
  dailyNeeds: [String],
  pricePreference: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },
  // supplierPreference: String,

  reviewsGiven: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  favoriteSuppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }],
  groupBuysJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "GroupBuy" }],

  // isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Vendor", VendorSchema);
