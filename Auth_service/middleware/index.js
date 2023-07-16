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
   return next();
  } catch (err) {
    return res.sendStatus(401);
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
        "requester",
        "tester",
        "admin",
      ].includes(role)
    ) {
      return next();
    }
    throw new Error('This is not role support.');
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

const testerRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "tester") {
      return next();
    }
    throw new Error('This is not role support.');
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
    throw new Error('This is not role support.');
  } catch (err) {
    res.sendStatus(401);
  }
};

const studentRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "student") {
      return next();
    }
    throw new Error('This is not role support.');
  } catch (err) {
    res.sendStatus(401);
  }
};
const teacherRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "teacher") {
      return next();
    }
    throw new Error('This is not role support.');
  } catch (err) {
    res.sendStatus(401);
  }
};
const labadminRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "labadmin") {
      return next();
    }
    throw new Error('This is not role support.');
  } catch (err) {
    res.sendStatus(401);
  }
};
const collegeorinstitueadminRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "collegeorinstitueadmin") {
      return  next();
    }
    throw new Error('This is not role support.');
  } catch (err) {
    res.sendStatus(401);
  }
};
const regionaladminRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "regionaladmin") {
      return next();
    }
    throw new Error('This is not role support.');
  } catch (err) {
    res.sendStatus(401);
  }
};
const superAdminRole = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role === "superadmin") {
      return next();
    }
    throw new Error('This is not role support.');
  } catch (err) {
    res.sendStatus(401);
  }
};

const errorLogger = (err, req, res, next) => {
  return next(err);
};

const errorResponder = (err, req, res, next) => {
  if(err){
  res.header("Content-Type", "application/json");
  return res.status(err.statusCode).send(JSON.stringify(err, null, 4));
  }
  return next();
};

const invalidPathHandler = (req, res, next) => {
  return res.send("The endpoint you are trying to reach does not exist.");
};

module.exports = {
  isAuthenticated,
  errorLogger,
  errorResponder,
  invalidPathHandler,
  commonRole,
  requesterRole,
  testerRole,
  adminRole,
  requesterOrAdminRole,
  studentRole,
  teacherRole,
  labadminRole,
  collegeorinstitueadminRole,
  regionaladminRole,
  superAdminRole,
};
