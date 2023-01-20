const jwt = require("jsonwebtoken");
const events = require("events");
const { redisClient, connectMessageQue } = require("../config");
const User = require("../models/User");

const EventEmitter = new events.EventEmitter();
EventEmitter.once("signIn", (data) => {
  console.log("Login emitter", data);
});
// register
async function register(req, res, next) {
  try {
    const channel = await connectMessageQue();
    const { name, email } = req.body;
    const userExits = await User.findOne({ email });
    if (userExits) return res.json({ message: "User already exists" });
    const newUser = new User({
      name,
      email,
    });
    await redisClient.connect();
    await redisClient.set(newUser._id.toString(), JSON.stringify(newUser));
    await redisClient.disconnect();
    newUser.save();
    channel.sendToQueue("EXPERIMENT:USER", Buffer.from(JSON.stringify(newUser)));
    channel.sendToQueue("FEEDBACK:USER", Buffer.from(JSON.stringify(newUser)));
    channel.sendToQueue("MOREINFO:USER", Buffer.from(JSON.stringify(newUser)));
    channel.sendToQueue("NOTE:USER", Buffer.from(JSON.stringify(newUser)));
    channel.sendToQueue("PROCEDURE:USER", Buffer.from(JSON.stringify(newUser)));
    channel.sendToQueue("PYTHON:USER", Buffer.from(JSON.stringify(newUser)));
    return res.json({ message: "User Successfully created" });
  } catch (error) {
    next(error);
  }
}

//login
async function login(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User does not exists" });
    const payload = {
      id: user._id,
      email,
      name: user.name,
    };

    EventEmitter.emit("signIn", {payload});
    jwt.sign(payload, "secret", (err, token) => {
      if (err) return res.status(500).json({ message: "Error in SignIn" });
      return res.json({ token });
    });
  } catch (error) {
    next(error);
  }
}

async function profile(req, res, next) {
  try {
    await redisClient.connect();
    const user = await redisClient.get(req.user.id);
    await redisClient.disconnect();
    return res.send({ data: JSON.parse(user) });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, profile };
