const firebaseAdmin = require("../Auth_service/services/firebase");

const User = require("../Auth_service/models/User");
const MoreInfo = require("../MoreInfo_service/models/MoreInfo");
const ProcedureUser = require("../Procedure_service/models/User");
const ExperimentUser = require("../Experiment_service/models/User");
const RunzUser = require("../Python_service/models/User");
const InventoryUser = require("../Inventory_service/models/User");
const CodeEditorUser = require("../CodeEditor_service/models/User");
const ChartUser = require("../Chart_service/models/User");

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

async function isAuthenticatedMoreInfo(req, res, next) {
  try {
    let firebaseUser;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      firebaseUser = await firebaseAdmin.auth.verifyIdToken(token);
    }
    if (!firebaseUser) return res.sendStatus(401);
    const moreinfo = await MoreInfo.findOne({
      email: firebaseUser.email,
    });
    const { email, userId, name, role } = moreinfo;
    if (!moreinfo) {
      return res.sendStatus(401);
    }
    req.user = { email, userId, name, role };
    next();
  } catch (err) {
    res.sendStatus(401);
  }
}

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
async function isAuthenticatedExperiment(req, res, next) {
  try {
    let firebaseUser;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      firebaseUser = await firebaseAdmin.auth.verifyIdToken(token);
    }
    if (!firebaseUser) return res.sendStatus(401);
    const user = await ExperimentUser.findOne({
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
async function isAuthenticatedInventory(req, res, next) {
  try {
    let firebaseUser;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      firebaseUser = await firebaseAdmin.auth.verifyIdToken(token);
    }
    if (!firebaseUser) return res.sendStatus(401);
    const user = await InventoryUser.findOne({
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

async function isAuthenticatedCodeEditor(req, res, next) {
  try {
    let firebaseUser;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      firebaseUser = await firebaseAdmin.auth.verifyIdToken(token);
    }
    if (!firebaseUser) return res.sendStatus(401);
    const user = await CodeEditorUser.findOne({
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
async function isAuthenticatedChart(req, res, next) {
  try {
    let firebaseUser;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      firebaseUser = await firebaseAdmin.auth.verifyIdToken(token);
    }
    if (!firebaseUser) return res.sendStatus(401);
    const user = await ChartUser.findOne({
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
  isAuthenticated,
  isAuthenticatedMoreInfo,
  isAuthenticatedProcedure,
  isAuthenticatedExperiment,
  isAuthenticatedRunz,
  isAuthenticatedInventory,
  isAuthenticatedCodeEditor,
  isAuthenticatedChart,
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
