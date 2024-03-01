const express = require("express");
const router = express.Router();

const {  fetchReferralPayoutForPartner } = require("../../controllers/partnerControllers");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/partner/fetch-referral-payout-for-partner", isAuthenticated,authorizeRole(["partner"]), fetchReferralPayoutForPartner)

module.exports = router;