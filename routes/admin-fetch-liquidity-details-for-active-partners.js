const express = require("express");
const router = express.Router();

const adminControllers = require("../controllers/adminControllers");
const checkAuthMiddleware = require("../middleware/checkAuth");
router.post(
  "/admin-fetch-liquidity-details-for-active-partners",
  checkAuthMiddleware.checkAuth,
  adminControllers.adminFetchLiquidityDetailsForActivePartners
);
module.exports = router;
