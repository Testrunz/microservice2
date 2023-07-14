const ProcedureUser = require("../models/User");

async function isAuthenticatedProcedure(req, res, next) {
  try {
    let firebaseUser;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      firebaseUser = await firebaseAdmin.auth.verifyIdToken(token);
    }
    if (!firebaseUser) return res.sendStatus(401);
    const user = await ProcedureUser.findOne({
      email: firebaseUser.email,
    });
    const { email, userId, name, role } = user;
    if (!user) {
      return res.sendStatus(401);
    }
    req.user = { email, userId, name, role };
    next();
  } catch (err) {
    res.sendStatus(401);
  }
}
const commonRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (
      [
        "superadmin",
        "regionaladmin",
        "collegeorinstitueadmin",
        "labadmin",
        "teacher",
        "student",
      ].includes(role)
    ) {
      next();
    }
  } catch (err) {
    res.sendStatus(401);
  }
};
const studentRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "student") {
      next();
    }
  } catch (err) {
    res.sendStatus(401);
  }
};
const teacherRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "teacher") {
      next();
    }
  } catch (err) {
    res.sendStatus(401);
  }
};
const labadminRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "labadmin") {
      next();
    }
  } catch (err) {
    res.sendStatus(401);
  }
};
const collegeorinstitueadminRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "collegeorinstitueadmin") {
      next();
    }
  } catch (err) {
    res.sendStatus(401);
  }
};
const regionaladminRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "regionaladmin") {
      next();
    }
  } catch (err) {
    res.sendStatus(401);
  }
};
const superAdminRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "superadmin") {
      next();
    }
  } catch (err) {
    res.sendStatus(401);
  }
};

const errorLogger = (err, req, res, next) => {
  console.error("\x1b[31m", err);
  next(err);
};

const errorResponder = (err, req, res, next) => {
  res.header("Content-Type", "application/json");
  res.status(err.statusCode).send(JSON.stringify(err, null, 4));
};

const invalidPathHandler = (req, res, next) => {
  return res.send("The endpoint you are trying to reach does not exist.");
};
module.exports = {
  isAuthenticatedProcedure,
  errorLogger,
  errorResponder,
  invalidPathHandler,
  commonRole,
  studentRole,
  teacherRole,
  labadminRole,
  collegeorinstitueadminRole,
  regionaladminRole,
  superAdminRole,
};
