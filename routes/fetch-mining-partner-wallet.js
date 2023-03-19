const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const partnerControllers = require('../controllers/partnerControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.post('/fetch-mining-partner-total-wallet',checkAuthMiddleware.checkAuth,partnerControllers.fetchMiningPartnerTotalWallet);
module.exports = router;