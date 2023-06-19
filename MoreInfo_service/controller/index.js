const MoreInfo = require("../models/MoreInfo");

const findAllInfo = async (req, res) => {
  try {
    if (req.user) {
      const result = await MoreInfo.find();
      res.status(200).json([...result]);
    }
  } catch (err) {
    res.status(500).send("system error");
  }
};

const findInfo = async (req, res) => {
  try {
    const { userId } = req.user;
    const result = await MoreInfo.findOne({ userId }).lean();
    res.status(200).json({ ...result });
  } catch (err) {
    res.status(500).send("system error");
  }
};

const updateInfo = async (req, res) => {
  try {
    const { userId, email } = req.user;
    const data = req.body;
    const result = await MoreInfo.findOneAndUpdate(
      { userId, email },
      {
        ...data,
      },
      { new: true }
    ).lean();

    res.status(200).json({ ...result });
  } catch (err) {
    res.status(500).send("system error");
  }
};

const addLabs = async (req, res) => {
  try {
    const { userId, email } = req.user;
    const { labtype } = req.body;
    const result = await MoreInfo.findOneAndUpdate(
      { userId, email },
      {
        $push: { labtype: { $each: labtype } },
      },
      { new: true }
    ).lean();
    res.status(200).json({ ...result });
  } catch (err) {
    res.status(500).send("system error");
  }
};
const removeLabs = async (req, res) => {
  try {
    const { userId, email } = req.user;
    const { labtype } = req.body;
    const result = await MoreInfo.findOneAndUpdate(
      { userId, email },
      {
        $pullAll: { labtype: labtype },
      },
      { new: true }
    ).lean();
    res.status(200).json({ ...result });
  } catch (err) {
    console.log(err);
    res.status(500).send("system error");
  }
};

module.exports = { findAllInfo, findInfo, updateInfo, addLabs, removeLabs };
