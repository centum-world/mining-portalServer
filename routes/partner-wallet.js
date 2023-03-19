const express = require('express');
const connection = require('../config/database');
const router = express.Router();
const cron = require('node-cron');
//let { query } = require('express');

const partnerControllers = require('../controllers/partnerControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.post('/fetch-partner-wallet-details',checkAuthMiddleware.checkAuth,partnerControllers.fetchPartnerWalletDetails);



module.exports = router;