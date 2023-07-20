const EventEmitter = require("events");
const firebaseAdmin = require("../services/firebase");
const User = require("../models/User");
const Setting = require("../models/Setting");
const { connectMessageQue, purgeMessageQue } = require("../config");

const eventEmitter = new EventEmitter();

eventEmitter.on("userinfo", async (data) => {
  const sendingData = JSON.stringify({
    id: data._id.toString(),
    name: data.name,
    email: data.email,
    role: data.role,
  });
  const amqpCtl = await connectMessageQue();
  amqpCtl.sendToQueue(
    process.env.RABBIT_MQ_PROCEDURE,
    Buffer.from(sendingData, "utf-8")
  );
  amqpCtl.sendToQueue(
    process.env.RABBIT_MQ_MOREINFO,
    Buffer.from(sendingData, "utf-8")
  );
  /* 
  amqpCtl.sendToQueue(process.env.RABBIT_MQ_MOREINFO, Buffer.from(sendingData, 'utf-8'));
  amqpCtl.sendToQueue(process.env.RABBIT_MQ_PROCEDURE, Buffer.from(sendingData, 'utf-8'));
  amqpCtl.sendToQueue(process.env.RABBIT_MQ_EXPERIMENT, Buffer.from(sendingData, 'utf-8'));
  amqpCtl.sendToQueue(process.env.RABBIT_MQ_RUNPYTHON, Buffer.from(sendingData, 'utf-8'));
  amqpCtl.sendToQueue(process.env.RABBIT_MQ_NOTES, Buffer.from(sendingData, 'utf-8'));
  amqpCtl.sendToQueue(process.env.RABBIT_MQ_FEEDBACK, Buffer.from(sendingData, 'utf-8'));
  amqpCtl.sendToQueue(process.env.RABBIT_MQ_INVENTORY, Buffer.from(sendingData, 'utf-8'));
  amqpCtl.sendToQueue(process.env.RABBIT_MQ_CODEEDITOR, Buffer.from(sendingData, 'utf-8'));
  amqpCtl.sendToQueue(process.env.RABBIT_MQ_CHART, Buffer.from(sendingData, 'utf-8'));
 */
  /* 
 await purgeMessageQue(process.env.RABBIT_MQ_MOREINFO)
 await purgeMessageQue(process.env.RABBIT_MQ_PROCEDURE)
 await purgeMessageQue(process.env.RABBIT_MQ_EXPERIMENT)
 await purgeMessageQue(process.env.RABBIT_MQ_RUNPYTHON)
 await purgeMessageQue(process.env.RABBIT_MQ_INVENTORY)
 await purgeMessageQue(process.env.RABBIT_MQ_CODEEDITOR)
 */
});
const validate = async (req, res) => {
  eventEmitter.emit("userinfo", req.user);
  res.status(200).json(req.user);
};
const updateValueMiddleware = async (req, res, next) => {
  const { email } = req.user;
  const filter = { email: email };
  const update = { $set: { firstuse: false } };
  try {
    await User.updateOne(filter, update);
    return res.status(200).send("Updated successfully");
  } catch (err) {
    console.log(err.code);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
  //firstuse
};
const register = async (req, res) => {
  const { email, name, password, timeZone } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({
      error:
        "Invalid request body. Must contain email, password, and name for user.",
    });
  }
  try {
    const newFirebaseUser = await firebaseAdmin.auth.createUser({
      email,
      password,
    });
    if (newFirebaseUser) {
      await User.create({
        email,
        name,
        firebaseId: newFirebaseUser.uid,
        timeZone,
      });
    }
    return res
      .status(200)
      .json({ success: "Account created successfully. Please sign in." });
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      return res
        .status(400)
        .json({ error: "User account already exists at email address." });
    }
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const firebaseGoogleSignin = async (req, res) => {
  const { email, name, uid, timeZone } = req.body;
  const filter = { email: email };
  const update = {
    $setOnInsert: { name: name, timeZone: timeZone, firebaseId: uid },
  };
  const options = { upsert: true };
  try {
    await User.updateOne(filter, update, options);
    return res
      .status(200)
      .json({ success: "Google Account logged successfully. Please sign in." });
  } catch (err) {
    console.log(err.code);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const firebaseMicrosoftSignin = async (req, res) => {
  const { email, name, uid, timeZone } = req.body;
  const filter = { email: email };
  const update = {
    $setOnInsert: { name: name, timeZone: timeZone, firebaseId: uid },
  };
  const options = { upsert: true };
  try {
    await User.updateOne(filter, update, options);
    return res.status(200).json({
      success: "Microsoft Account logged successfully. Please sign in.",
    });
  } catch (err) {
    console.log(err.code);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const firebaseLinkedInSignin = async (req, res) => {
  const { email, name, uid, timeZone } = req.body;
  const filter = { email: email };
  const update = {
    $setOnInsert: { name: name, timeZone: timeZone, firebaseId: uid },
  };
  const options = { upsert: true };
  try {
    await User.updateOne(filter, update, options);
    return res.status(200).json({
      success: "Linkedin Account logged successfully. Please sign in.",
    });
  } catch (err) {
    console.log(err.code);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const findAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    return res.json([...users]);
  } catch (err) {
    console.log(err.code);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const initiateSetting = async(req, res)=>{
  try {
    await Setting.create({organizationId: req.body.organizationId})
    return res.send("Setting initiated");
  } catch (err) {
    console.log(err.code);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
}

const findSetting = async(req, res)=>{
  try {
    const result = await Setting.find({organizationId: req.query.organizationId})
    return res.json(result);
  } catch (err) {
    console.log(err.code);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
}

const updateSetting = async(req, res)=>{
  try {
    const {organizationId} = req.params;
    const {notification, roleSetting} = req.body
    const filter = { organizationId: organizationId };
    const update = {
      $set: {
        notification,
        roleSetting,
      },
    }
    const result = await Setting.updateOne(filter, update)
    return res.json(result);
  } catch (err) {
    console.log(err.code);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
}

module.exports = {
  validate,
  updateValueMiddleware,
  register,
  firebaseGoogleSignin,
  firebaseMicrosoftSignin,
  firebaseLinkedInSignin,
  findAllUser,
  initiateSetting,
  findSetting,
  updateSetting
};