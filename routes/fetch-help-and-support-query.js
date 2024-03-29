const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.get('/fetch-help-and-support-query',checkAuthMiddleware.checkAuth,
adminControllers.fetchHelpAndSupportQuery);
module.exports = router;