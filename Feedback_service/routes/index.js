const { Router } = require("express");
const feedbackRoutes = require("./feedback/feedback");

const router = new Router();
router.use(feedbackRoutes);
module.exports = router;
