const express = require('express');
const router = express.Router();


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { createPartnerPayoutForMonthly } = require('../controllers/adminControllers');



router.post('/create-partner-payout-for-monthly',isAuthenticated,authorizeRole(["admin"]),createPartnerPayoutForMonthly);

module.exports = router;