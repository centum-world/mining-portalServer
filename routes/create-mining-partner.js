const express = require('express');
const connection = require('../config/database');
const router = express.Router();
require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID 
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require("twilio")(accountSid, authToken);
const adminControllers = require('../controllers/adminControllers');

const checkAuthMiddleware = require('../middleware/checkAuth');


router.post('/create-mining-partner',checkAuthMiddleware.isAuthenticated,adminControllers.createMiningPartner);


// fetch Mining Partner
router.get('/fetch-mining-partner',checkAuthMiddleware.checkAuth,adminControllers.fetchMiningPartner);

module.exports = router;