const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 

require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID 
const authToken = process.env.TWILIO_AUTH_TOKEN
//const client = require("twilio")(accountSid, authToken);

const signupController = require('../controllers/signupControllers');

router.post('/partner-signup',upload.fields([{ name: 'adhar_front_side' },{ name: 'adhar_back_side' }, {name: "panCard"}]),signupController.partnerSignup);



module.exports = router;
