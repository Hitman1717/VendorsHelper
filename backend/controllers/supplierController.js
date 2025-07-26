const Supplier = require("../models/Supplier");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 1. Register a new supplier
const registerSupplier = async (req, res) => {
  try {
    const { shopName, ownerName, phone, email, password, supplierType, address } = req.body;

    const existing = await Supplier.findOne({ phone });
    if (existing) return res.status(400).json({ message: "Supplier already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newSupplier = await Supplier.create({
      shopName,
      ownerName,
      phone,
      email,
      passwordHash,
      supplierType,
      address,
    });

    res.status(201).json({
      _id: newSupplier._id,
      shopName: newSupplier.shopName,
      token: generateToken(newSupplier._id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// 2. Get logged-in supplier profile
const getSupplierProfile = async (req, res) => {
  const supplier = await Supplier.findById(req.user.id).select("-passwordHash");
  if (!supplier) return res.status(404).json({ message: "Supplier not found" });

  res.json(supplier);
};

// 3. Update supplier profile
const updateSupplierProfile = async (req, res) => {
  const supplier = await Supplier.findById(req.user.id);
  if (!supplier) return res.status(404).json({ message: "Supplier not found" });

  const updates = req.body;

  if (updates.password) {
    const salt = await bcrypt.genSalt(10);
    updates.passwordHash = await bcrypt.hash(updates.password, salt);
    delete updates.password;
  }

  const updated = await Supplier.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-passwordHash");
  res.json(updated);
};

// 4. Public: List all suppliers
const listSuppliers = async (req, res) => {
  const suppliers = await Supplier.find().select("shopName address rating totalReviews verified");
  res.json(suppliers);
};

module.exports = {
  registerSupplier,
  getSupplierProfile,
  updateSupplierProfile,
  listSuppliers,
};