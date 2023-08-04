const User = require("../models/User");
const Procedure = require("../models/Procedure");
const createProcedure = async (req, res) => {
  try {
    const { title, html, createdBy } = req.body;
    const procedure = new Procedure({ title, html, createdBy });
    const result = await procedure.save();
    const user = await User.findOne({ userId: req.user.userId });
    user.procedureIds.push(result._id);
    const newUser = await user.save();
    return res.status(200).json({ ...newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const duplicateProcedure = async (req, res) => {
  try {
    const { id } = req.body;
    const { title, html, createdBy } = await Procedure.find({ _id: id });
    const procedure = new Procedure({ title, html, createdBy });
    await procedure.save();
    return res.status(200).send("Duplicate created");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const listAllProcedureAssociate = async (req, res) => {
  try {
    const { department, labtype, id, createdBy, createdOn } = req.query;
    const user = await User.findOne({ userId: req.user.userId });
    const ids = user.procedureIds.map(async (ele) => {
      const tempId = ele.toString();
      const { title, createdBy, createdAt } = await Procedure.findOne({
        _id: tempId,
      });
      return { id: tempId, title, createdBy, createdAt };
    });
    Promise.all(ids)
      .then((data) => {
        console.log("DATA", data);
        if (department || labtype || id || createdBy || createdOn) {
          console.log("DATA", data);
        }
        return res.status(200).json({ user, data: [...data] });
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const procedureById = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    const procedure = await Procedure.findById(req.params.id);
    return res.status(200).json({ user, procedure });
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const procedureByTitle = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    const procedure = await Procedure.findOne({ title: req.params.title });
    return res.status(200).json({ user, procedure });
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const editprocedureById = async (req, res) => {
  try {
    const procedure = await Procedure.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );
    return res.status(200).json(procedure);
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const deleteprocedureById = async (req, res) => {
  try {
    const { ids } = req.body;
    await Procedure.deleteMany({ _id: { $in: ids } });
    await User.updateMany(
      { procedureIds: { $in: ids } },
      { $pullAll: { procedureIds: ids } }
    );
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
module.exports = {
  createProcedure,
  duplicateProcedure,
  listAllProcedureAssociate,
  procedureById,
  procedureByTitle,
  editprocedureById,
  deleteprocedureById,
};
