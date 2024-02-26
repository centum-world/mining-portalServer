const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {   fetchTotalReferralCountAndTodayReferralCount } = require("../controllers/adminControllers");

router.get("/fetch-total-referral-count-and-today-referral-count", isAuthenticated,authorizeRole(["admin"]), fetchTotalReferralCountAndTodayReferralCount)

module.exports = router;
