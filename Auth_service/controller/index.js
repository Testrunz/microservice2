const firebaseAdmin = require("../services/firebase");
const User = require("../models/User");

const validate = async (req, res) => {
  console.log("user", req.user);
  res.status(200).json(req.user);
};

const register = async (req, res) => {
  const { email, name, password } = req.body;
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
  const { email, name, uid } = req.body;
  const filter = { email: email };
  const update = { $setOnInsert: { name: name, firebaseId: uid } };
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

module.exports = {validate, register, firebaseGoogleSignin}