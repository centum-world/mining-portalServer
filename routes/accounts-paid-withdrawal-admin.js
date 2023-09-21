const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.get('/accounts-paid-withdrawal-admin',checkAuthMiddleware.checkAuth,
adminControllers.accountsPaidWithdrawal);
module.exports = router;