const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.get('/fetch-partner-refferal-approve-withdrawal',checkAuthMiddleware.checkAuth,
adminControllers.fetchPartnerRefferalApproveWithdrawal);
module.exports = router;