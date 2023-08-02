const { Router } = require("express");
const multer = require("multer");
const {
  validate,
  updateValueMiddleware,
  register,
  createUser,
  firebaseGoogleSignin,
  firebaseMicrosoftSignin,
  firebaseLinkedInSignin,
  removeUser,
  initiateSetting,
  findSetting,
  updateSetting,
  uploadimage,
} = require("../../controller");

const {
  isAuthenticated,
  commonRole,
  requesterOrAdminRole,
  adminRole,
} = require("../../middleware");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = new Router();

router.post("/upload", upload.single("image"), uploadimage);
router.post("/auth/create", createUser)
router.post("/auth/register", register);
router.post("/auth/googlelogin", firebaseGoogleSignin);
router.post("/auth/microsoftlogin", firebaseMicrosoftSignin);
router.post("/auth/linkedinlogin", firebaseLinkedInSignin);
router.get("/auth/me", isAuthenticated, commonRole, validate);
router.patch("/auth/me", isAuthenticated, commonRole, updateValueMiddleware);
router.patch("/auth/remove", isAuthenticated, adminRole, removeUser)
router.post("/setting/:organizationId", isAuthenticated, adminRole, initiateSetting);
router.get("/setting/:organizationId", isAuthenticated, adminRole, findSetting);
router.patch("/setting/:organizationId", isAuthenticated, adminRole, updateSetting);

module.exports = router;
