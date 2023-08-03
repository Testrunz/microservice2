const EventEmitter = require("events");
const sharp = require("sharp");
const firebaseAdmin = require("../services/firebase");
const { uploadFile, getObjectSignedUrl } = require("../services/upload");
const User = require("../models/User");
const Setting = require("../models/Setting");
const { connectMessageQue, purgeMessageQue } = require("../config");
const generateRandomPassword = require("../services/randomPass");
const mailing = require("../services/mailing");

function padNumber(num) {
  return num.toString().padStart(5, "0");
}

const eventEmitter = new EventEmitter();
const emitEvent = (eventName, data) => {
  return new Promise((resolve, reject) => {
    eventEmitter.emit(eventName, data, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

eventEmitter.on("userinfo", async (data, callback) => {
  try {
    const sendingData = JSON.stringify({
      id: data._id.toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      organization: "Organisation 1",
      department: "Department 1",
      laboratory: "Lab 1",
      counter: padNumber(data.counter.value),
    });
    const amqpCtl = await connectMessageQue();

    amqpCtl.sendToQueue(
      process.env.RABBIT_MQ_MOREINFO,
      Buffer.from(sendingData, "utf-8")
    );
    amqpCtl.sendToQueue(
      process.env.RABBIT_MQ_PROCEDURE,
      Buffer.from(sendingData, "utf-8")
    );

    callback(null, "Event handled successfully");
  } catch (error) {
    callback(error);
  }
});

eventEmitter.on("adduser", async (data, callback) => {
  try {
  const sendingData = JSON.stringify({
    type: "createuser",
    ...data,
  });
  const amqpCtl = await connectMessageQue();
  amqpCtl.sendToQueue(
    process.env.RABBIT_MQ_MOREINFO,
    Buffer.from(sendingData, "utf-8")
  );
  amqpCtl.sendToQueue(
    process.env.RABBIT_MQ_PROCEDURE,
    Buffer.from(sendingData, "utf-8")
  );
  callback(null, "Event handled successfully");
} catch (error) {
  callback(error);
}
});

const validate = async (req, res) => {
  await emitEvent("userinfo", req.user);
  res.status(200).json(req.user);
};

const updateValueMiddleware = async (req, res, next) => {
  const { email } = req.user;
  const filter = { email: email };
  const update = { $set: { ...req.body } };
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

const createUser = async (req, res) => {
  try {
    const {
      email,
      name,
      timeZone,
      firstname,
      lastname,
      labtype,
      organization,
      department,
      role,
      activeStatus,
    } = req.body;
    const password = generateRandomPassword(12);
    const msg = {
      to: email,
      from: "testrunz.learny@gmail.com",
      subject: "Testrunz User created",
      text: "An account is created in testrunz you can play around as guset user",
      html: `<strong>this is your password: ${password}</strong>`,
    };

    const newFirebaseUser = await firebaseAdmin.auth.createUser({
      email,
      password,
    });
    if (newFirebaseUser) {
      const newUser = await User.create({
        email,
        name,
        firebaseId: newFirebaseUser.uid,
        timeZone,
        firstname,
        lastname,
        role,
        activeStatus,
      });
      await mailing(msg);
      await emitEvent("adduser", {
        type: "createuser",
        email,
        name,
        userId: newFirebaseUser.uid,
        userCounter: newUser.counter.value,
        timeZone,
        firstname,
        lastname,
        role,
        activeStatus,
        labtype,
        organization,
        department,
      });
    }
    return res.status(200).json({
      success:
        "Account created successfully. Please check your mail for password.",
    });
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      return res
        .status(400)
        .json({ error: "User account already exists at email address." });
    }
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const removeUser = async (req, res) => {
  try {
    const uuid = req.user.userId;
    await firebaseAdmin.auth.updateUser(uuid, {
      disabled: true,
    });
    return res.status(200).json({ success: "user disabled successfully" });
  } catch (err) {
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

const initiateSetting = async (req, res) => {
  try {
    await Setting.create({ organizationId: req.params.organizationId });
    return res.send("Setting initiated");
  } catch (err) {
    console.log(err.code);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const findSetting = async (req, res) => {
  try {
    const result = await Setting.find({
      organizationId: req.params.organizationId,
    });
    return res.json(result);
  } catch (err) {
    console.log(err.code);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const updateSetting = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { notification, roleSetting } = req.body;
    const filter = { organizationId: organizationId };
    const update = {
      $set: {
        notification,
        roleSetting,
      },
    };
    const result = await Setting.updateOne(filter, update);
    return res.json(result);
  } catch (err) {
    console.log(err.code);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

const uploadimage = async (req, res) => {
  try {
    const file = req.file;
    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: "contain" })
      .toBuffer();
    const imageName = file.originalname;
    await uploadFile(fileBuffer, imageName, file.mimetype);
    const imageUrl = await getObjectSignedUrl(imageName);
    res.json({ imageUrl });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

module.exports = {
  validate,
  updateValueMiddleware,
  register,
  createUser,
  firebaseGoogleSignin,
  firebaseMicrosoftSignin,
  firebaseLinkedInSignin,
  removeUser,
  initiateSetting,
  findSetting,
  updateSetting,
  uploadimage,
};
