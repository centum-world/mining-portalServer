const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const partnerControllers = require('../controllers/partnerControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.post('/fetch-partner-approve-withdrawal-history-for-partner',checkAuthMiddleware.checkAuth,
partnerControllers.fetchPartnerApproveWithdrawalHistoryForPartner);
module.exports = router;