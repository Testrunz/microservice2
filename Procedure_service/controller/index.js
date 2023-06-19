const User = require("../models/User");
const Procedure = require("../models/Procedure");
const createProcedure = async (req, res) => {
  try {
    const { title, html } = req.body;
    const procedure = new Procedure({ title, html });
    const result = await procedure.save();
    const user = await User.findOne({ userId: req.user.userId });
    user.procedureIds.push(result._id);
    const newUser = await user.save();
    return res.status(200).json({ ...newUser });
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const listAllProcedureAssociate = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    const ids = user.procedureIds.map(async (ele) => {
      const tempId = ele.toString();
      const { title } = await Procedure.findOne({ _id: tempId });
      return { id: tempId, title };
    });
    Promise.all(ids)
      .then((data) => {
        return res.status(200).json([...data]);
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
    const procedure = await Procedure.findById(req.params.id);
    return res.status(200).json(procedure);
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const procedureByTitle = async (req, res) => {
  try {
    const procedure = await Procedure.findOne({ title: req.params.title });
    return res.status(200).json(procedure);
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
    await User.findOneAndUpdate({userId: req.user.userId }, {$pull: {procedureIds: req.params.id}})
    await Procedure.deleteOne({_id: req.params.id})
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
module.exports = {
  createProcedure,
  listAllProcedureAssociate,
  procedureById,
  procedureByTitle,
  editprocedureById,
  deleteprocedureById,
};
