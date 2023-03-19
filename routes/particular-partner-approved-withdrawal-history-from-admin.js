const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/particular-partner-approved-withdrawal-history-from-admin', checkAuthMiddleware.checkAuth,adminControllers.particularPartnerApprovedWithdrawalHistoryFromAdmin);

module.exports =router;