const { Router } = require("express");
const moreinfoRoutes = require("./moreinfo/moreinfo");

const router = new Router();
router.use(moreinfoRoutes);
module.exports = router;
