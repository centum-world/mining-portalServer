const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.get('/fetch-member-approve-withdrawal-history-for-admin',checkAuthMiddleware.checkAuth,
adminControllers.fetchMemberApproveWithdrawalHistoryForAdmin);
module.exports = router;