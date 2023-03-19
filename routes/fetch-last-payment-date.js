const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/fetch-last-payment-date',checkAuthMiddleware.checkAuth,adminControllers.fetchLastPaymentDate);

module.exports =router;