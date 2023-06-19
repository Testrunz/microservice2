const { Router } = require("express");

const { validate, register, firebaseGoogleSignin } = require("../../controller");

const { isAuthenticated, commonRole } = require("../../../middleware");

const router = new Router();

router.post("/auth/register", register);
router.post("/auth/googlelogin", firebaseGoogleSignin);
router.get("/auth/me", isAuthenticated, commonRole, validate);

module.exports = router;
