const express = require("express");
const router = express.Router();
const {
  initiateGroupBuy,
  joinGroupBuy,
  getAllGroupBuys,
  finalizeGroupBuy
} = require("../controllers/groupBuyController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, initiateGroupBuy);         // vendor only
router.post("/:id/join", protect, joinGroupBuy);     // vendor only
router.get("/", getAllGroupBuys);                    // public
router.post("/:id/finalize", protect, finalizeGroupBuy); // vendor (creator) only

module.exports = router;
