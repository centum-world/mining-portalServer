const express = require("express");
const router = express.Router();

const { 
    fetchReferralMyTeam } = require("../../controllers/stateController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/state/fetch-referral-my-team", isAuthenticated,authorizeRole(["state","admin", "franchise",]), fetchReferralMyTeam)

module.exports = router;
//route