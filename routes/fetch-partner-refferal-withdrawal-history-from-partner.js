const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/partnerControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.post('/fetch-partner-refferal-withdrawal-history-from-partner',checkAuthMiddleware.checkAuth,
adminControllers.fetchPartnerRefferalWithdrawalHistoryFromPartner);
module.exports = router;