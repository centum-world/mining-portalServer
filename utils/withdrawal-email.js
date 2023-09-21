var nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASS
  }
});
module.exports = function email(to,amount)
{
    let serviceCharge = (amount.withdrawalAmount*5)/100;
    let payaybleAmount = (amount.withdrawalAmount-serviceCharge);
    let userid = amount.userId;
    console.log(userid,'16');

    mailOptions = {
        from: process.env.FROM_EMAIL,
        to: to,
        subject: 'Grettings From CENTUM WORLD',
        text: `${userid} Your Withdrawal request is approved of an Amount of Rs:- ${amount.withdrawalAmount} , Service Charge Rs:- ${serviceCharge} And Payable Amount is Rs:- ${payaybleAmount}` 
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}
    