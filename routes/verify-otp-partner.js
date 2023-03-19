const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

const partnerControllers = require('../controllers/partnerControllers');

router.post('/verify-otp-partner',partnerControllers.verifyOtpPartner);



module.exports = router;