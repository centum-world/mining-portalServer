const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {
    fetchAllPartnerPayoutCount,
} = require("../controllers/adminControllers");

router.post("/fetch-All-partner-payout-count", fetchAllPartnerPayoutCount);
module.exports = router;
