const { Router } = require("express");

const {
  createInventory,
  listInventories,
  getInventories,
  getInventory,
  editInventory,
  deleteInventory,
} = require("../../controller");
const { isAuthenticatedInventory, commonRole } = require("../../../middleware");

const router = new Router();

router.post(
  "/inventory",
  isAuthenticatedInventory,
  commonRole,
  createInventory
);
router.get(
  "/inventories",
  isAuthenticatedInventory,
  commonRole,
  getInventories
);
router.get("/inventory", isAuthenticatedInventory, commonRole, listInventories);
router.get(
  "/inventory/:id",
  isAuthenticatedInventory,
  commonRole,
  getInventory
);
router.patch(
  "/inventory/:id",
  isAuthenticatedInventory,
  commonRole,
  editInventory
);
router.delete(
  "/inventory/:id",
  isAuthenticatedInventory,
  commonRole,
  deleteInventory
);

module.exports = router;
