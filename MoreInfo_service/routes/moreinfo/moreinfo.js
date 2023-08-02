const { Router } = require("express");
const {
  findAllInfo,
  findInfo,
  updateInfo,
  updateStatus,
  disableBulkUsers,
  addLabs,
  removeLabs,
  createInfo,
  listmoreinfoContent,
} = require("../../controller");
const { isAuthenticatedMoreInfo, commonRole } = require("../../middleware");
const router = new Router();
router.post("/moreinfocreate", createInfo);
router.get("/moreinfo/list", listmoreinfoContent);
router.get("/moreinfo", isAuthenticatedMoreInfo, commonRole, findAllInfo);
router.get("/moreinfo/user", isAuthenticatedMoreInfo, commonRole, findInfo);
router.patch("/moreinfo", isAuthenticatedMoreInfo, commonRole, updateInfo);
router.patch("/moreinfo/disableuser", isAuthenticatedMoreInfo, disableBulkUsers)
router.patch("/moreinfo/:id", isAuthenticatedMoreInfo, updateStatus);
router.patch("/moreinfo/addlabs", isAuthenticatedMoreInfo, commonRole, addLabs);
router.patch(
  "/moreinfo/removelabs",
  isAuthenticatedMoreInfo,
  commonRole,
  removeLabs
);

module.exports = router;
