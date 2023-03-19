const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const partnerControllers = require('../controllers/partnerControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.post('/fetch-sum-of-partner-all-withdrawal',checkAuthMiddleware.checkAuth,
partnerControllers.fetchSumOfPartnerAllWithdrawal);
module.exports = router;