const Institute = require("../models/Institue");
const createInstitute = async (req, res) => {
  try {
    const newInstitute = new Institute({ ...req.body });
    const institue = await newInstitute.save();
    res.status(200).json({ institue });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const findAllUniversity = async (req, res) => {
  try {
    const result = await Institute.distinct("university");
    res.status(200).json([...result]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const findAllInstitueinUniversity = async (req, res) => {
  try {
    let result = await Institute.find({ university: req.query.university });
    result = result.map((ele) => ele.institute);
    result = new Set(result);
    res.status(200).json([...result]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const findInstitue = async (req, res) => {
  try {
    const result = await Institute.find({ institute: req.params.institute });
    res.status(200).json([...result]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

module.exports = {
  createInstitute,
  findAllUniversity,
  findAllInstitueinUniversity,
  findInstitue
};
