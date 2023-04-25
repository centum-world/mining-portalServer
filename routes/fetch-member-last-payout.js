const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const memberControllers = require('../controllers/memberControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/fetch-member-last-payout',checkAuthMiddleware.checkAuth,memberControllers.fetchMemberLastPayout);
module.exports = router;