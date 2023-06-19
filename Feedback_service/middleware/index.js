const jwt = require("jsonwebtoken");

async function isAuthenticated(req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(404).json({ message: "User not authorized" });
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

module.exports = {
  isAuthenticated,
  errorLogger,
  errorResponder,
  invalidPathHandler,
};
