const { Router } = require("express");
const authRoutes = require("./auth/auth");

const router = new Router();
router.use(authRoutes);
module.exports = router;
