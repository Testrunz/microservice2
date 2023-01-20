const { Router } = require("express");

const { register, login, profile } = require("../../controller");

const { isAuthenticated } = require("../../middleware");

const router = new Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", isAuthenticated, profile);

module.exports = router;
