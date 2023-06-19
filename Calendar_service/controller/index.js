const User = require("../models/User");
const Inventory = require("../models/Inventory");
const createInventory = async (req, res) => {
  try {
    const inventory = new Inventory({ ...req.body });
    let temp = await inventory.save();
    temp = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $push: { inventoryIds: temp._id } },
      { new: true }
    ).lean();
    return res.status(200).json(temp);
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const listInventories = async (req, res) => {
  try {
    let temp = await User.findOne({ userId: req.user.userId }).lean();
    temp = temp.inventoryIds.map((ele) => ele.toString());
    return res.status(200).json(temp);
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const getInventories = async (req, res) => {
  try {
    const temp = await Inventory.find();
    return res.status(200).json(temp);
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const getInventory = async (req, res) => {
  try {
    const temp = await Inventory.findById(req.params.id).lean();
    return res.status(200).json(temp);
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const editInventory = async (req, res) => {
  try {
    const temp = await Inventory.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).lean();
    return res.status(200).json(temp);
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const deleteInventory = async (req, res) => {
  try {
    await Inventory.deleteOne({ _id: req.params.id });
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
module.exports = {
  createInventory,
  listInventories,
  getInventories,
  getInventory,
  editInventory,
  deleteInventory,
};
