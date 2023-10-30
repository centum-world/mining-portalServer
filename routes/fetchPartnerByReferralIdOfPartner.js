const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const partnerControllers = require('../controllers/partnerControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.post('/fetch-partner-by-referral-id-of-partner',checkAuthMiddleware.isAuthenticated,
partnerControllers.fetchPartnerByReferralIdOfPartner);
module.exports = router;