const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/perday-amount-transfer-to-partner-manaul',checkAuthMiddleware.checkAuth,adminControllers.perdayAmountTransferToPartnerManual);

module.exports =router;