const { Router } = require("express");
const chartRoutes = require("./chart/chart");

const router = new Router();
router.use(chartRoutes);
module.exports = router;
