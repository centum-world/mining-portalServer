require('dotenv').config();
const http = require('http');
const app = require('./index');
const sms = require('./utils/successfull-add-sms');

const server = http.createServer(app);

server.listen(process.env.PORT);

console.log('hiii from server');

// const accountSid = process.env.ACCOUNT_SID;
// const authToken = process.env.AUTH_TOKEN;
// const smsKey = process.env.SMS_SECRET_KEY;
// let twilioNum = process.env.TWILIO_PHONE_NUMBER;

