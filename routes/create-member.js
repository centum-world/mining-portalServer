const express = require('express');
const router = express.Router();
// require('dotenv').config();
// const accountSid = process.env.ACCOUNT_SID 
// const authToken = process.env.TWILIO_AUTH_TOKEN
// const client = require("twilio")(accountSid, authToken);

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/create-member',checkAuthMiddleware.checkAuth,adminControllers.createMember);

router.get('/fetch-member', checkAuthMiddleware.checkAuth,adminControllers.fetchMember);

module.exports = router;