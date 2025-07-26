const Supplier = require("../models/Supplier");

// @desc    Get current supplier profile
// @route   GET /api/suppliers/me
// @access  Private
exports.getSupplierProfile = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.user.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(supplier);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update supplier profile
// @route   PUT /api/suppliers/me
// @access  Private
exports.updateSupplierProfile = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.user.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const updates = req.body;

    Object.keys(updates).forEach(key => {
      supplier[key] = updates[key];
    });

    const updated = await supplier.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    List all suppliers (public)
// @route   GET /api/suppliers
// @access  Public
exports.listSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().select("-password");
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch suppliers" });
  }
};
