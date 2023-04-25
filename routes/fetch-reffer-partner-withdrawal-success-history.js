const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const partnerControllers = require('../controllers/partnerControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/fetch-reffer-partner-withdrawal-success-history',checkAuthMiddleware.checkAuth,
partnerControllers.fetchRefferPartnerWithdrawalSuccessHistory);
module.exports = router;