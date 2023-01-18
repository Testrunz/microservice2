const jwt = require("jsonwebtoken");

const User = require("../models/User");

// register
async function register(req, res, next) {
  try {
    const { name, email } = req.body;
    const userExits = await User.findOne({ email });
    if (userExits) return res.json({ message: "User already exists" });
    const newUser = new User({
      name,
      email,
    });
    newUser.save();
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
    jwt.sign(payload, "secret", (err, token) => {
      if (err) return res.status(500).json({ message: "Error in SignIn" });
      return res.json({ token });
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
