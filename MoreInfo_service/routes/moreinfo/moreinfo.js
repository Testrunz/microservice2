const { Router } = require("express");
const { findAllInfo, findInfo, updateInfo, addLabs, removeLabs } = require("../../controller");
const { isAuthenticatedMoreInfo, commonRole } = require("../../middleware");

const router = new Router();

router.get("/moreinfo", isAuthenticatedMoreInfo, commonRole, findAllInfo);
router.get("/moreinfo/user", isAuthenticatedMoreInfo, commonRole, findInfo);
router.patch("/moreinfo", isAuthenticatedMoreInfo, commonRole, updateInfo);
router.patch("/moreinfo/addlabs", isAuthenticatedMoreInfo, commonRole, addLabs);
router.patch("/moreinfo/removelabs", isAuthenticatedMoreInfo, commonRole, removeLabs);

module.exports = router;
