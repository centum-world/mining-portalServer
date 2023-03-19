const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/update-mining-partner-profile-details-from-admin',checkAuthMiddleware.checkAuth,
adminControllers.updateMiningPartnerProfileDetailsFromAdmin);

module.exports = router;