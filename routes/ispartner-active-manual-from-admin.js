const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/ispartner-active-manual-from-admin', checkAuthMiddleware.checkAuth,adminControllers.isPartnerActiveManualFromAdmin);

module.exports =router;