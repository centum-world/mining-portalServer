const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
router.post('/doactivate-partner-manual-from-admin',adminControllers.doActivatePartnerManualFromAdmin);

module.exports =router;