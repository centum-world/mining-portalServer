const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.post('/fetch-particular-help-And-support-query',checkAuthMiddleware.checkAuth,adminControllers.fetchParticularHelpAndSupportQuery);
module.exports = router;