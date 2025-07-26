const bcrypt = require("bcryptjs");
const Vendor = require("../models/Vendor");
const Supplier = require("../models/Supplier");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!["vendor", "supplier"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const Model = role === "vendor" ? Vendor : Supplier;
  const existing = await Model.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await Model.create({ name, email, phone, passwordHash: hashed });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    role,
    token: generateToken(user._id, role),
  });
};

exports.loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  const Model = role === "vendor" ? Vendor : Supplier;
  const user = await Model.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    _id: user._id,
    name: user.name,
    role,
    token: generateToken(user._id, role),
  });
};
