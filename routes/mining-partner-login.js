const express = require('express');
//const connection = require('../config/database');
const router = express.Router();
require('dotenv').config();

const partnerControllers = require('../controllers/partnerControllers'); 

router.post('/mining-partner-login',partnerControllers.miningPartnerLogin);


module.exports = router;