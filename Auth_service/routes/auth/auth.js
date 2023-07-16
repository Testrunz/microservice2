const { Router } = require("express");

const { validate, register, firebaseGoogleSignin, firebaseMicrosoftSignin, firebaseLinkedInSignin, findAllUser } = require("../../controller");

const { isAuthenticated, commonRole, requesterOrAdminRole } = require("../../middleware");

const router = new Router();

router.post("/auth/register", register);
router.post("/auth/googlelogin", firebaseGoogleSignin);
router.post("/auth/microsoftlogin", firebaseMicrosoftSignin);
router.post("/auth/linkedinlogin", firebaseLinkedInSignin);
router.get("/auth/me", isAuthenticated, commonRole, validate);
router.get("/users", isAuthenticated, requesterOrAdminRole, findAllUser)

module.exports = router;
