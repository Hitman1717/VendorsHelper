const bcrypt = require("bcryptjs");
const Vendor = require("../models/Vendor");
const Supplier = require("../models/Supplier");
const generateToken = require("../utils/generateToken");

// Register Vendor Only
// exports.registerVendor = async (req, res) => {
//   try {
//     const {
//       name,
//       businessName,
//       phone,
//       email,
//       password,
//       location,
//       dailyNeeds,
//       pricePreference,
//     } = req.body;

//     if (!name || !phone || !password) {
//       return res.status(400).json({ message: "Please provide name, phone, and password." });
//     }

//     const existingVendor = await Vendor.findOne({ phone });
//     if (existingVendor) {
//       return res.status(400).json({ message: "A vendor with this phone number already exists." });
//     }

//     if (email) {
//       const existingEmail = await Vendor.findOne({ email });
//       if (existingEmail) {
//         return res.status(400).json({ message: "A vendor with this email already exists." });
//       }
//     }

//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(password, salt);

//     const newVendor = await Vendor.create({
//       name,
//       businessName,
//       phone,
//       email,
//       passwordHash,
//       location,
//       dailyNeeds,
//       pricePreference,
//       role: "vendor",
//     });

//     res.status(201).json({
//       _id: newVendor._id,
//       name: newVendor.name,
//       phone: newVendor.phone,
//       role: newVendor.role,
//       token: generateToken(newVendor._id, newVendor.role),
//     });
//   } catch (err) {
//     console.error("Vendor registration error:", err);
//     res.status(500).json({ message: "Server error during vendor registration." });
//   }
// };

// // Register Supplier Only
// exports.registerSupplier = async (req, res) => {
//   try {
//     const { shopName, ownerName, phone, email, password, supplierType, address } = req.body;

//     if (!shopName || !ownerName || !phone || !password) {
//       return res.status(400).json({ message: "Please provide shop name, owner name, phone, and password." });
//     }

//     const existing = await Supplier.findOne({ phone });
//     if (existing) {
//       return res.status(400).json({ message: "A supplier with this phone number already exists." });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(password, salt);

//     const newSupplier = await Supplier.create({
//       shopName,
//       ownerName,
//       phone,
//       email,
//       passwordHash,
//       supplierType,
//       address,
//       role: "supplier",
//     });

//     res.status(201).json({
//       _id: newSupplier._id,
//       shopName: newSupplier.shopName,
//       role: newSupplier.role,
//       token: generateToken(newSupplier._id, newSupplier.role),
//     });
//   } catch (err) {
//     console.error("Supplier registration error:", err);
//     res.status(500).json({ message: "Server error during supplier registration." });
//   }
// };

// Unified Register (Vendor or Supplier)
exports.register = async (req, res) => {
  try {
    const {
      name,
      businessName,
      phone,
      email,
      password,
      businessLocation,
      landMark,
      pincode,
      role,
    } = req.body;

    if (!businessName || !name || !phone || !password || !role) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (role === "supplier") {
      const existingSupplier = await Supplier.findOne({ phone });
      if (existingSupplier) {
        return res.status(400).json({ message: "A supplier with this phone number already exists." });
      }

      const newSupplier = await Supplier.create({
        shopName: businessName,
        ownerName: name,
        phone,
        email,
        passwordHash,
        role,
        address: {
          businessLocation,
          landMark,
          pincode,
        },
      });

      return res.status(201).json({
        _id: newSupplier._id,
        shopName: newSupplier.shopName,
        role: newSupplier.role,
        token: generateToken(newSupplier._id, newSupplier.role),
      });
    } else if (role === "vendor") {
      const existingVendor = await Vendor.findOne({ phone });
      if (existingVendor) {
        return res.status(400).json({ message: "A vendor with this phone number already exists." });
      }

      const newVendor = await Vendor.create({
        businessName,
        name,
        phone,
        email,
        passwordHash,
        role,
        address: {
          businessLocation,
          landMark,
          pincode,
        },
      });

      return res.status(201).json({
        _id: newVendor._id,
        name: newVendor.name,
        role: newVendor.role,
        token: generateToken(newVendor._id, newVendor.role),
      });
    } else {
      return res.status(400).json({ message: "Invalid role provided." });
    }
  } catch (err) {
    console.error("Unified registration error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// Login (for both vendor and supplier)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    const user = await Vendor.findOne({ email }) || await Supplier.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.json({
      _id: user._id,
      name: user.name || user.ownerName,
      shopName: user.shopName || user.businessName,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
};
