const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.get('/fetch-partner-refferal-withdrawal-request',checkAuthMiddleware.checkAuth,
adminControllers.fetchPartnerRefferalWithdrawalRequest);
module.exports = router;