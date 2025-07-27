const bcrypt = require("bcryptjs");
const Vendor = require("../models/Vendor");
const Supplier = require("../models/Supplier");
const generateToken = require("../utils/generateToken");

// (Your commented-out registerUser function)
// exports.registerUser = async (req, res) => { ... };


exports.registerVendor = async (req, res) => {
  try {
    const {
      name,
      businessName,
      phone,
      email,
      password,
      location,
      dailyNeeds,
      pricePreference
    } = req.body;

    // 1. Check for required fields
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Please provide name, phone, and password." });
    }

    // 2. Check if a vendor with the same phone number already exists
    const existingVendor = await Vendor.findOne({ phone });
    if (existingVendor) {
      return res.status(400).json({ message: "A vendor with this phone number already exists." });
    }
    
    // 3. Check if a vendor with the same email already exists (if email is provided)
    if (email) {
        const existingEmail = await Vendor.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "A vendor with this email already exists." });
        }
    }

    // 4. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Create the new vendor in the database
    const newVendor = await Vendor.create({
      name,
      businessName,
      phone,
      email,
      passwordHash,
      location,
      // dailyNeeds,
      // pricePreference
    });

    // 6. Respond with the new vendor's info and a JWT
    res.status(201).json({
      _id: newVendor._id,
      name: newVendor.name,
      phone: newVendor.phone,
      token: generateToken(newVendor._id, "vendor"),
    });

  } catch (err) {
    console.error("Vendor registration error:", err);
    res.status(500).json({ message: "Server error during vendor registration." });
  }
};

exports.registerSupplier = async (req, res) => {
  try {
    const { shopName, ownerName, phone, email, password, supplierType, address } = req.body;

    // --- FIX: Added validation for required fields ---
    if (!shopName || !ownerName || !phone || !password) {
      return res.status(400).json({ message: "Please provide shop name, owner name, phone, and password." });
    }
    // --- END FIX ---

    const existing = await Supplier.findOne({ phone });
    if (existing) return res.status(400).json({ message: "A supplier with this phone number already exists." });

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
      token: generateToken(newSupplier._id, "supplier"),
    });
  } catch (err) {
    console.error("Supplier registration error:", err);
    res.status(500).json({ message: "Server error during supplier registration." });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please provide email, password, and role." });
    }

    
    const user = await Model.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials." });

    res.json({
      _id: user._id,
      name: user.name || user.ownerName, // Handle both vendor and supplier name fields
      shopName: user.shopName,
      role:user.role,
      token: generateToken(user._id, role),
    });
  } catch(err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
};
