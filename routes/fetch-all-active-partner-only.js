const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.get('/fetch-all-active-partner-only',checkAuthMiddleware.checkAuth,adminControllers.fetchAllActivePartnerOnly);
module.exports = router;