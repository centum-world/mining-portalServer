const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/partnerControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/isPartner-active-from-partner', checkAuthMiddleware.checkAuth,adminControllers.isPartnerActiveFromPartner);

module.exports =router;