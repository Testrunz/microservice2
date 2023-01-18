const jwt = require("jsonwebtoken");

async function isAuthenticated(req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(404).json({ message: "User not authorized" });
    req.user = user;
    next();
  });
}

module.exports = isAuthenticated;
