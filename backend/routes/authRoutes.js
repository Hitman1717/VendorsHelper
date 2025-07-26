const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const {registerSupplier,getSupplierProfile} = require("../controllers/supplierController")
router.post("/register", registerUser);
 // Accepts role: 'vendor' or 'supplier'
router.post("/registersupply",registerSupplier)
router.post("/login", loginUser);

module.exports = router;
