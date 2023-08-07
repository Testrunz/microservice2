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
    return res.status(200).json({ ...newUser, createdProcedure: result._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const duplicateProcedure = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const user = await User.findOne({ userId: req.user.userId });
    for (const id of ids) {
      const { title, html, createdBy } = await Procedure.findById(id);
      const procedure = new Procedure({ title, html, createdBy });
      const savedProcedure = await procedure.save();
      user.procedureIds.push(savedProcedure._id);
    }

    await user.save();
    return res.status(200).send("Duplicate created");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const listAllProcedureAssociate = async (req, res) => {
  try {
    const { department, labtype, id, createdBy, createdOn } = req.query;

    const userFilterCriteria = {
      userId: req.user.userId
    };
    if (department) userFilterCriteria.department = department;
    if (labtype) userFilterCriteria.labtype = labtype;

    const userData = await User.findOne(userFilterCriteria)
      .select('name organization department labtype procedureIds')
      .lean();

    // Check if user is found
    if (!userData) {
      return res.status(200).json({ });
    }

    // Check if the user has associated procedures
    if (!userData.procedureIds || userData.procedureIds.length === 0) {
      return res.status(200).json({ ...userData, procedureIds: [] });
    }

    const procedureFilterCriteria = {
      _id: { $in: userData.procedureIds }
    };
    if (id) procedureFilterCriteria._id = id;
    if (createdBy) procedureFilterCriteria.createdBy = createdBy;
    if (createdOn && Date.parse(createdOn)) {
      procedureFilterCriteria.createdAt = { $gte: new Date(createdOn) };
    }

    const procedures = await Procedure.find(procedureFilterCriteria)
      .select('title createdBy createdAt')
      .lean();

    const filteredProcedures = procedures.map(proc => ({
      id: proc._id,
      title: proc.title,
      createdBy: proc.createdBy,
      createdOn: proc.createdAt
    }));

    return res.status(200).json({ ...userData, procedureIds: filteredProcedures });
  } catch (error) {
    console.error("Error fetching procedures: ", error); // Log the error
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
