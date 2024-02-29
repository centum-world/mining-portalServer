const express = require("express");
const router = express.Router();

const {  fetchReferralPayoutHistoryAdmin } = require("../controllers/adminControllers");
const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");

router.post("/fetch-referral-payout-history-admin", isAuthenticated,
authorizeRole(["admin"]),fetchReferralPayoutHistoryAdmin)

module.exports = router;