const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");
const Supplier = require("../models/Supplier");

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };

    if (decoded.role === "vendor") {
      req.profile = await Vendor.findById(decoded.id);
    } else if (decoded.role === "supplier") {
      req.profile = await Supplier.findById(decoded.id);
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Token validation failed" });
  }
};

module.exports = { protect };
