const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");

router.post('/member-referral-payout-history',isAuthenticated,authorizeRole(["admin","member"]),adminControllers.memberReferralPayoutHistory);
module.exports = router;