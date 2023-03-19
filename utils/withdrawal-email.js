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
    mailOptions = {
        from: process.env.FROM_EMAIL,
        to: to,
        subject: 'Grettings From CENTUM WORLD',
        text: `Your Withdrawal request is approved of an Amount of - ${amount.withdrawalAmount}` 
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}
    