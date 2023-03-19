const express = require('express');
const connection = require('../config/database');
const router = express.Router();

partnerControllers = require('../controllers/partnerControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/mining-partner-profile-details',checkAuthMiddleware.checkAuth,partnerControllers.miningPartnerProfileDetails);

module.exports = router;