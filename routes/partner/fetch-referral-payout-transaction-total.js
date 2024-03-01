const express = require("express");
const router = express.Router();

const {
  fetchReferralPayoutTransactionTotal,
} = require("../../controllers/partnerControllers");
const {
  isAuthenticated,
  authorizeRole,
} = require("../../middleware/checkAuth");

router.post(
  "/partner/fetch-referral-payout-transaction-total",
  isAuthenticated,
  authorizeRole(["partner"]),
  fetchReferralPayoutTransactionTotal
);

module.exports = router;
