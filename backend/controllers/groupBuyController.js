const GroupBuy = require("../models/GroupBuy");
const Product = require("../models/Product");

exports.initiateGroupBuy = async (req, res) => {
  if (req.user.role !== "vendor") return res.status(403).json({ message: "Only vendors can start a group buy" });

  const { productId, targetQuantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const groupBuy = new GroupBuy({
    product: productId,
    targetQuantity,
    joinedVendors: [req.user.id],
    createdBy: req.user.id
  });

  const saved = await groupBuy.save();
  res.status(201).json(saved);
};

exports.joinGroupBuy = async (req, res) => {
  if (req.user.role !== "vendor") return res.status(403).json({ message: "Only vendors can join" });

  const groupBuy = await GroupBuy.findById(req.params.id);
  if (!groupBuy) return res.status(404).json({ message: "GroupBuy not found" });

  if (groupBuy.joinedVendors.includes(req.user.id)) {
    return res.status(400).json({ message: "Already joined" });
  }

  groupBuy.joinedVendors.push(req.user.id);
  await groupBuy.save();
  res.json({ message: "Joined group buy", groupBuy });
};

exports.getAllGroupBuys = async (req, res) => {
  const groups = await GroupBuy.find()
    .populate("product")
    .populate("joinedVendors", "name businessName");

  res.json(groups);
};

exports.finalizeGroupBuy = async (req, res) => {
  const groupBuy = await GroupBuy.findById(req.params.id);
  if (!groupBuy) return res.status(404).json({ message: "Group buy not found" });

  if (groupBuy.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: "Only creator can finalize" });
  }

  groupBuy.finalized = true;
  await groupBuy.save();
  res.json({ message: "Group buy finalized", groupBuy });
};
