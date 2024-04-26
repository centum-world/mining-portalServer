const express = require("express");
const router = express.Router();

const {
    myPayoutCount,
} = require("../../controllers/partnerControllers");
const {
  isAuthenticated,
  authorizeRole,
} = require("../../middleware/checkAuth");

router.post(
  "/partner/my-payout-count",
  isAuthenticated,
  authorizeRole(["partner","admin"]),
  myPayoutCount
);

module.exports = router;
