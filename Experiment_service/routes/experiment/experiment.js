const { Router } = require("express");
const {
  createExperiment,
  listAllExperiments,
  playExperiment,
  editExperiment,
} = require("../../controller");
const {
  isAuthenticatedExperiment,
  commonRole,
} = require("../../../middleware");
const router = new Router();

router.post(
  "/experiment",
  isAuthenticatedExperiment,
  commonRole,
  createExperiment
);
router.get(
  "/experiment",
  isAuthenticatedExperiment,
  commonRole,
  listAllExperiments
);
router.get(
  "/experiment/:id",
  isAuthenticatedExperiment,
  commonRole,
  playExperiment
);
router.patch(
  "/experiment/:id",
  isAuthenticatedExperiment,
  commonRole,
  editExperiment
);
module.exports = router;
