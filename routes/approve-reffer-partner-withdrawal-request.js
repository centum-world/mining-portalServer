const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');

const checkAuthMiddleware = require('../middleware/checkAuth');

router.post('/approve-reffer-partner-withdrawal-request',checkAuthMiddleware.checkAuth ,adminControllers.approveRefferPartnerWithdrawalRequest);
module.exports = router;