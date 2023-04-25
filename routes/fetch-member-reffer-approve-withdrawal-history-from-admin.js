const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.get('/fetch-member-reffer-approve-withdrawal-history-from-admin',checkAuthMiddleware.checkAuth,
adminControllers.fetchMemberRefferApproveWithdrawalHostoryFromAdmin);
module.exports = router;