const { Router } = require("express");
const inventoryRoutes = require("./inventory/inventory");

const router = new Router();
router.use(inventoryRoutes);
module.exports = router;
