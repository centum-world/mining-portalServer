const express = require('express');
//const connection = require('../config/database');
const router = express.Router();
const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.post('/member-withdrawal-history-details',checkAuthMiddleware.checkAuth,
adminControllers.approveMemberWithdrawalRequest );
module.exports = router;