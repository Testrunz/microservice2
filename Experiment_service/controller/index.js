const EventEmitter = require("events");
const User = require("../models/User");
const Experiment = require("../models/Experiment");
const { connectMessageQue } = require("../config");

const eventEmitter = new EventEmitter();

eventEmitter.on("playrunz", async (data) => {
  const sendingData = JSON.stringify({ ...data });
  const amqpCtl = await connectMessageQue();
  amqpCtl.sendToQueue(
    process.env.RABBIT_MQ_EXPERIMENTFROM,
    Buffer.from(sendingData, "utf-8")
  );
});

const createExperiment = async (req, res) => {
  try {
    const experiment = new Experiment({ ...req.body });
    const result = await experiment.save();
    const user = await User.findOne({ userId: req.user.userId });
    user.experimentIds.push(result._id);
    const newUser = await user.save();
    return res.status(200).json({ newUser });
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const listAllExperiments = async (req, res) => {
  try {
    let expUser = await User.findOne({ userId: req.user.userId }).lean();
    expUser = expUser.experimentIds.map((ele) => ele.toString());
    return res.status(200).json(expUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const playExperiment = async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id);
    eventEmitter.emit("playrunz", {
      id: experiment._id.toString(),
      procedureId: experiment.procedureId,
      datas: experiment.datas,
      ...req.user,
    });
    return res.status(200).json({ experiment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const editExperiment = async (req, res) => {
  try {
    const newExp = await Experiment.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).json(newExp);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

module.exports = {
  createExperiment,
  listAllExperiments,
  playExperiment,
  editExperiment,
};
