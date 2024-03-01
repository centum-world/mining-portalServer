const express = require("express");
const router = express.Router();

const checkAuthMiddleware = require("../middleware/checkAuth");
const {
  fliterPayoutTotalAndMonthlyWise,
} = require("../controllers/adminControllers");
router.get(
  "/fliter-payout-total-and-monthlywise",
  checkAuthMiddleware.isAuthenticated,
  checkAuthMiddleware.authorizeRole(["admin"]),
  fliterPayoutTotalAndMonthlyWise
);
module.exports = router;
