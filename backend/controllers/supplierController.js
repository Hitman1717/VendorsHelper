const Supplier = require("../models/Supplier");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id ,role}, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 2. Get logged-in supplier profile
const getSupplierProfile = async (req, res) => {
  const supplier = await Supplier.findById(req.user.id).select("-passwordHash");
  if (!supplier) return res.status(404).json({ message: "Supplier not found" });

  res.json(supplier);
};

// 3. Update supplier profile
const updateSupplierProfile = async (req, res) => {
  try {
      // req.user.id should be available from your 'protect' middleware
      const supplier = await Supplier.findById(req.user.id);
      if (!supplier) {
          return res.status(404).json({ message: "Supplier not found" });
      }

      const { 
          shopName, 
          ownerName, 
          phone, 
          email, 
          password, 
          address, 
          supplierType, 
          gstNumber, 
          licenseNumber, 
          deliveryOptions, 
          isActive 
      } = req.body;

      const updateData = {};
      if (shopName) updateData.shopName = shopName;
      if (ownerName) updateData.ownerName = ownerName;
      if (address) updateData.address = address;
      if (supplierType) updateData.supplierType = supplierType;
      if (gstNumber) updateData.gstNumber = gstNumber;
      if (licenseNumber) updateData.licenseNumber = licenseNumber;
      if (deliveryOptions) updateData.deliveryOptions = deliveryOptions;
      if (typeof isActive === 'boolean') updateData.isActive = isActive;

      if (email && email !== supplier.email) {
          const existing = await Supplier.findOne({ email });
          if (existing) {
              return res.status(400).json({ message: "This email is already in use." });
          }
          updateData.email = email;
      }

      if (phone && phone !== supplier.phone) {
          const existing = await Supplier.findOne({ phone });
          if (existing) {
              return res.status(400).json({ message: "This phone number is already in use." });
          }
          updateData.phone = phone;
      }

      if (password) {
          const salt = await bcrypt.genSalt(10);
          updateData.passwordHash = await bcrypt.hash(password, salt);
      }

      const updatedSupplier = await Supplier.findByIdAndUpdate(
          req.user.id, 
          { $set: updateData }, 
          { new: true, runValidators: true }
      ).select("-passwordHash");

      res.json(updatedSupplier);
  } catch (error) {
      console.error("Update supplier profile error:", error);
      res.status(500).json({ message: "Server Error" });
  }
};

// 4. Public: List all suppliers
const listSuppliers = async (req, res) => {
  const suppliers = await Supplier.find().select("shopName address rating totalReviews verified");
  res.json(suppliers);
};

module.exports = {
  getSupplierProfile,
  updateSupplierProfile,
  listSuppliers,
};