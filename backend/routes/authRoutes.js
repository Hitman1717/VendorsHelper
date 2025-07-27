const express = require("express");
const router = express.Router();
// const { registerVendor, loginUser,registerSupplier } = require("../controllers/authController");
const {loginUser,register}=require("../controllers/authController")
const {getSupplierProfile} = require("../controllers/supplierController")
// router.post("/registervendor", registerVendor);

// router.post("/registersupply",registerSupplier)

router.post("/register",register)

router.post("/login", loginUser);

module.exports = router;
