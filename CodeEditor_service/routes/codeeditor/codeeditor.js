const { Router } = require("express");
const { dummy } = require("../../controller");

const {
  isAuthenticatedCodeEditor,
  commonRole,
} = require("../../../middleware");

const router = new Router();

router.get("/code", isAuthenticatedCodeEditor, commonRole, dummy);

module.exports = router;
