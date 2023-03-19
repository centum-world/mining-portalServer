const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const memberControllers = require('../controllers/memberControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.post('/fetch-sum-of-member-wallet-of-month',checkAuthMiddleware.checkAuth,memberControllers.fetchSumOfMemberWalletOfMonth);
module.exports = router;