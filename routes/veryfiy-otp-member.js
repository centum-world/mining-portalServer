const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const memberControllers = require('../controllers/memberControllers');
//const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/veryfiy-otp-member',memberControllers.verifyOtp);


module.exports = router;