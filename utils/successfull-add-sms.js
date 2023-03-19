
require('dotenv').config();

//const adminControllers = require('../controllers/adminControllers');

const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require("twilio")(accountSid, authToken);

module.exports = function sms(to, credential) {


    client.messages
        .create({ body: `Your ${credential.type} ID:-  ${credential.userid} and Password:- ${credential.password} Link:-${"https://www.centumworld.com/"}`, from: "+19788181810", to: to })
        .then((e) => {
          
        })
        .catch(e => console.log("err", e))
}
