const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

//const sms = require('./successfull-add-sms');
require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID 
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require("twilio")(accountSid, authToken);

const signupController = require('../controllers/signupControllers');
//const { jwt } = require('twilio');
//const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/member-signup',signupController.memberSignup);


module.exports = router;