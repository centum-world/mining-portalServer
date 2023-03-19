const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');

const checkAuthMiddleware = require('../middleware/checkAuth');

router.post('/partner-withdrawal-history-details',checkAuthMiddleware.checkAuth ,adminControllers.approvePartnerWithdrawalRequest );
module.exports = router;