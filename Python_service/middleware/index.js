const firebaseAdmin = require("../services/firebase");
const RunzUser = require("../models/User");

async function isAuthenticatedRunz(req, res, next) {
  try {
    let firebaseUser;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      firebaseUser = await firebaseAdmin.auth.verifyIdToken(token);
    }
    if (!firebaseUser) return res.sendStatus(401);
    const user = await RunzUser.findOne({
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
        "requester",
        "admin",
      ].includes(role)
    ) {
      next();
    }
  } catch (err) {
    res.sendStatus(401);
  }
};
const adminRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "admin") {
      return next();
    }
    throw new Error("This is not role support.");
  } catch (err) {
    res.sendStatus(401);
  }
};
const requesterRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "requester") {
      return next();
    }
    throw new Error('This is not role support.');
  } catch (err) {
    res.sendStatus(401);
  }
};
const requesterOrAdminRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (["requester", "admin"].includes(role)) {
      return next();
    }
    throw new Error("This is not role support.");
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

module.exports -
  {
    isAuthenticatedRunz,
    errorLogger,
    errorResponder,
    invalidPathHandler,
    commonRole,
    requesterRole,
    adminRole,
    requesterOrAdminRole,
    teacherRole,
    labadminRole,
    collegeorinstitueadminRole,
    regionaladminRole,
    superAdminRole,
  };
