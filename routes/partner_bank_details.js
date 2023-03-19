const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const partnerControllers = require('../controllers/partnerControllers'); 
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/partner-bank-details',checkAuthMiddleware.checkAuth,partnerControllers.addPartnerBankBetails);


module.exports = router;