const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/fetch-mining-partner-profile-details-from-admin',
checkAuthMiddleware.isAuthenticated, checkAuthMiddleware.authorizeRole(["admin"]),adminControllers.fetchMiningPartnerProfileDetailsFromAdmin);

module.exports = router;