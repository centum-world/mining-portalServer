const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/fetch-member-profile-details-from-admin',checkAuthMiddleware.checkAuth,adminControllers.fetchMemberProfileDetailsFromAdmin);

module.exports = router;