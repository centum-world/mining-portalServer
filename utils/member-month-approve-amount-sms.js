
require('dotenv').config();

//const adminControllers = require('../controllers/adminControllers');

const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require("twilio")(accountSid, authToken);
const date = require('date-and-time')

module.exports = function memberWithdrawalSms(to, credential) {

    const now  =  new Date();
    const value = date.format(now,'YYYY/MM/DD HH:mm:ss');
    client.messages
        // .create({ body: `Your ${credential.type} ID:-  ${credential.userid} and Password:- ${credential.password} Link:-${"https://www.centumworld.com/"}`, from: "+19788181810", to: to })
        .create({body: ` Greeting From CENTUM WORLD Your ${credential.type} ID:- ${credential.userid} has a credit by Transfer of Rs ${credential.amount}.00  on ${value} by CENTUM WORLD to Your Bank Account.`, from: "+14406353895", to: to})
        .then((e) => {
          
        })
        .catch(e => console.log("err", e))
}
