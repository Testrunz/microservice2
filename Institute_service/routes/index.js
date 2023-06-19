const { Router } = require("express");
const instituteRoutes = require("./institute/institute");

const router = new Router();
router.use(instituteRoutes);
module.exports = router;
