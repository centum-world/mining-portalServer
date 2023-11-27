const express = require("express");
const router = express.Router();

const { fetchPartnerByReferralId } = require("../../controllers/stateController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/state/fetch-partner-by-referral-id", isAuthenticated,authorizeRole(["state", "franchise", "member"]), fetchPartnerByReferralId)

module.exports = router;
