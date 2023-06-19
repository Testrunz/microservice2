const { Router } = require("express");
const { createInstitute, findAllUniversity, findAllInstitueinUniversity, findInstitue } = require("../../controller")

const router = new Router();

router.post("/create/institute", createInstitute);
router.get("/university", findAllUniversity)
router.get("/institute", findAllInstitueinUniversity)
router.get("/institute/:institute", findInstitue)

module.exports = router;
