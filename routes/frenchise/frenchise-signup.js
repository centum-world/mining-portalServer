const express = require('express');
const router = express.Router();
require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID 
const authToken = process.env.TWILIO_AUTH_TOKEN
//const client = require("twilio")(accountSid, authToken);

const signupController = require('../../controllers/signupControllers');

router.post('/frenchise/frenchise-signup',signupController.frenchiseSignup);


module.exports = router;
