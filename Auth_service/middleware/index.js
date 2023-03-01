const firebaseAdmin = require("../services/firebase");

const User = require("../models/User");

async function isAuthenticated(req, res, next) {
  try {
    let firebaseUser;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      firebaseUser = await firebaseAdmin.auth.verifyIdToken(token);
    }
    if (!firebaseUser) return res.sendStatus(401);
    const user = await User.findOne({
      firebaseId: firebaseUser.user_id,
    });
    if (!user) {
      return res.sendStatus(401);
    }

    req.user = user;

    next();
  } catch (err) {
    res.sendStatus(401);
  }
}

const errorLogger = (err, req, res, next) => {
  console.error("\x1b[31m", err);
  next(err);
};

const errorResponder = (err, req, res, next) => {
  res.header("Content-Type", "application/json");
  res.status(err.statusCode).send(JSON.stringify(err, null, 4));
};

const invalidPathHandler = (req, res, next) => {
  res.redirect("/error");
};

module.exports = {
  isAuthenticated,
  errorLogger,
  errorResponder,
  invalidPathHandler,
};
