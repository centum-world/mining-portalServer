const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.get('/fetch-sum-of-member-wallet-for-month-for-admin',checkAuthMiddleware.checkAuth,
adminControllers.fetchSumOfMemberWalletForMonthForAdmin);
module.exports = router;