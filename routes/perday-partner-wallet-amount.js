const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

//let { query } = require('express');

const partnerControllers = require('../controllers/partnerControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.post('/perday-partner-wallet-amount',checkAuthMiddleware.checkAuth,
partnerControllers.perdayPartnerWalletAmount);



module.exports = router;