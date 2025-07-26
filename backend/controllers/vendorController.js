const Vendor = require("../models/Vendor");

exports.getVendorProfile = async (req, res) => {
  if (req.user.role !== "vendor") return res.status(403).json({ message: "Forbidden" });

  const vendor = await Vendor.findById(req.user.id).select("-passwordHash");
  res.json(vendor);
};

exports.updateVendorProfile = async (req, res) => {
  if (req.user.role !== "vendor") return res.status(403).json({ message: "Forbidden" });

  const updates = req.body;
  const updated = await Vendor.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-passwordHash");
  res.json(updated);
};

exports.listVendors = async (req, res) => {
  const vendors = await Vendor.find().select("name businessName location");
  res.json(vendors);
};
