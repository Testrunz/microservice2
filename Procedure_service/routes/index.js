const { Router } = require("express");
const procedureRoutes = require("./procedure/procedure");

const router = new Router();
router.use(procedureRoutes);
module.exports = router;
