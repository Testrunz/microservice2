const { Router } = require("express");
const pythonRoutes = require("./python/python");

const router = new Router();
router.use(pythonRoutes);
module.exports = router;
