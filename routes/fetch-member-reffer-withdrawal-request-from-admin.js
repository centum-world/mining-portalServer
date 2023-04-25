const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.get('/fetch-member-reffer-withdrawal-request-from-admin',checkAuthMiddleware.checkAuth,
adminControllers.fetchMemberRefferWithdrawalRequestFromAdmin);
module.exports = router;