const jwt = require("jsonwebtoken");

const User = require("../models/User");

async function isAuthenticated(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, "secret", async(err, user) => {
    if (err) return res.status(403).json({ message: "User not authorized" });
    const userExits = await User.findOne({ _id: user.id });
    if (!userExits) return res.sendStatus(404)
    req.user = user;
    next();
  });
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


module.exports = {isAuthenticated, errorLogger, errorResponder, invalidPathHandler }