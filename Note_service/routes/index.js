const { Router } = require("express");
const noteRoutes = require("./note/note");

const router = new Router();
router.use(noteRoutes);
module.exports = router;
