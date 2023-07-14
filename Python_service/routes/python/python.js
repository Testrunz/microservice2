const { Router } = require("express");
const { playPython } = require("../../controller");

const { isAuthenticatedRunz, commonRole } = require("../../middleware");

const router = new Router();

router.get("/runz/:title/:id", isAuthenticatedRunz, commonRole, playPython);

module.exports = router;
