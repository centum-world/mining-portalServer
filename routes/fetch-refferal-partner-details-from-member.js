const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const memberControllers = require('../controllers/memberControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/fetch-refferal-partner-details-from-member',checkAuthMiddleware.checkAuth,
 memberControllers.fetchRefferalPartnerDetailsFromMember);
module.exports = router;