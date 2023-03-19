const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');

const checkAuthMiddleware = require('../middleware/checkAuth');

router.get('/fetch-all-partner-total-wallet-amount-from-admin',
 checkAuthMiddleware.checkAuth,adminControllers.fetchAllPartnerTotalWalletAmountFromAdmin);
module.exports = router;