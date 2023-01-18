const { Router } = require("express");
const experimentRoutes = require("./experiment/experiment");

const router = new Router();
router.use(experimentRoutes);
module.exports = router;
