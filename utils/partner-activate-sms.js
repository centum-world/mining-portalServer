
require('dotenv').config();

//const adminControllers = require('../controllers/adminControllers');

const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require("twilio")(accountSid, authToken);

module.exports = function doPartnerActivateSms(to, credential) {

    console.log(to,credential.liquidity,'12');
    client.messages
        .create({ body: ` Hi Welcome to CENTUM WORLD. Your Mining Partner Liquidity amount of rupees Rs:-${credential.liquidity} Added Successfully. Link:-${"https://www.centumworld.com/"}`, from: "+14406353895", to: to })
        .then((e) => {
          
        })
        .catch(e => console.log("err", e))
}
