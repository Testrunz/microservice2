const { Router } = require("express");
const codeEditorRoutes = require("./codeeditor/codeeditor");

const router = new Router();
router.use(codeEditorRoutes);
module.exports = router;
