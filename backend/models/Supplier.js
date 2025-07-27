const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  ownerName: String,
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  role:{type:String,default:"supplier"},
  address: {
    businessLocation: String,
    landMark: String,
    pincode: String,
    // geo: {
    //   lat: Number,
    //   lng: Number
    // }
  },

  supplierType: {
    type: String,
    enum: ["Wholesaler", "Retailer", "Manufacturer", "Farmer"]
  },
  gstNumber: String,
  licenseNumber: String,
  verified: { type: Boolean, default: false },

  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  deliveryOptions: {
    areasServed: [String],
    deliveryCharge: Number,
    minOrderValue: Number
  },

  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Supplier", SupplierSchema);
