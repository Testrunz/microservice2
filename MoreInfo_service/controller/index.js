const MoreInfo = require("../models/MoreInfo");
const MoreInfoContent = require("../models/MoreInfoContent");

const findAllInfo = async (req, res) => {
  try {
    const { department, labtype, organization, role, activeStatus, createdAt } =
      req.query;
    const filterCriteria = {
      $and: [],
    };

    if (department) {
      filterCriteria.$and.push({ department: { $in: [department] } });
    }

    if (labtype) {
      filterCriteria.$and.push({ labtype: { $in: [labtype] } });
    }

    if (organization) {
      filterCriteria.$and.push({ organization: organization });
    }

    if (role) {
      filterCriteria.$and.push({ role: role });
    }

    if (activeStatus) {
      filterCriteria.$and.push({ activeStatus: activeStatus });
    }

    if (createdAt && Date.parse(createdAt)) {
      filterCriteria.$and.push({ createdAt: { $gte: new Date(createdAt) } });
    }

    if (req.user) {
      let result = [];
      if (filterCriteria.$and.length > 0) {
        result = await MoreInfo.find(filterCriteria);
      } else {
        result = await MoreInfo.find();
      }
      res.status(200).json([...result]);
    }
  } catch (err) {
    console.log(err);
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

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await MoreInfo.findOneAndUpdate(
      { userId: id },
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

const disableBulkUsers = async (req, res) => {
  try {
    const { ids } = req.body;
    await MoreInfo.updateMany(
      { userId: { $in: ids } },
      { $set: { activeStatus: false } }
    );
    res.status(200).json("Bulk Disable done");
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

const createInfo = async (req, res) => {
  try {
    const data = req.body;
    await MoreInfoContent.create({ ...data });
    res.status(200).send("moreinfoContent added successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("system error");
  }
};

const listmoreinfoContent = async (req, res) => {
  try {
    const result = await MoreInfoContent.find({});
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("system error");
  }
};

module.exports = {
  findAllInfo,
  findInfo,
  updateInfo,
  updateStatus,
  disableBulkUsers,
  addLabs,
  removeLabs,
  createInfo,
  listmoreinfoContent,
};
