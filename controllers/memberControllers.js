const jwt = require("jsonwebtoken");
const connection = require("../config/database");
const bcrypt = require("bcrypt");
const forgetpasswordSms = require("../utils/forget-password-otp");
const sms = require("../utils/successfull-add-sms");
//const { query } = require('express');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const {
  isValidImage,
  isValidEmail,
  isValidPhone,
  isValidName,
  isValidPassword,
  isValidUserId,
} = require("../utils/validation");

// hash compare password

exports.memberLogin = (req, res) => {
  const member = req.body;
  let query =
    "select m_userid, m_password,reffer_id from create_member where m_userid=?";
  connection.query(query, [member.m_userid], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        bcrypt.compare(
          member.m_password,
          results[0].m_password,
          function (err, result) {
            if (result) {
              console.log("success");
              const response = {
                m_userid: results[0].m_userid,
                role: "member",
              };
              const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
                expiresIn: "8h",
              });
              res.status(200).json({
                token: accessToken,
                message: "Successfully logedIn",
                data: results,
              });
            } else {
              return res
                .status(401)
                .json({ message: "Incorrect username or password" });
            }
          }
        );
      } else {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
    } else {
      return res.status(500).json({ message: "Server Error" });
    }
  });
};

// exports.memberLogin = (req,res,next)=>{

//     const member = req.body;
//     query = "select m_userid, m_password,reffer_id  from create_member where m_userid=?";
//     connection.query(query,[member.m_userid], (err, results)=>{
//         if(!err){
//             if(results.length <= 0 || results[0].m_password != member.m_password){
//                 return res.status(401).json({message:"Incorrect username or password"});
//             }else if(results[0].m_password == member.m_password){
//                 const response = {m_userid: results[0].m_userid}

//                 const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN,{expiresIn:'8h'})
//                 res.status(200).json({
//                     token:accessToken,
//                     message:"Successfully logedIn",
//                     data:results

//                     });
//             }else{
//                 return res.status(400).json({message:"Something went wrong"});
//             }

//         }else{
//             return res.status(500).json(err);
//         }
//     })
// }

//Fetch Member Details
exports.fetchMemberDetails = (req, res) => {
  const memberId = req.body;
  let query = "select *from create_member where m_userid = ?";
  connection.query(query, [memberId.m_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched data successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// Add member Bank Details
exports.addMemberBankDetails = (req, res) => {
  let bank = req.body;
  let query =
    "insert into bank_details(user_id,holder_name,account_no,ifsc_code,branch_name,bank_name)  values (?,?,?,?,?,?)";
  connection.query(
    query,
    [
      bank.user_id,
      bank.holder_name,
      bank.account_no,
      bank.ifsc_code,
      bank.branch_name,
      bank.bank_name,
    ],
    (err, results) => {
      if (!err) {
        return res.status(200).json({
          message: "Bank Details Added successfully",
          data: results,
        });
      } else {
        return res.status(500).json(err);
      }
    }
  );
};

//Fetch Member Bank Details
exports.fetchMemberBankDetails = (req, res) => {
  const memberId = req.body;
  let query = "select * from bank_details where user_id = ?";
  connection.query(query, [memberId.user_id], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Bank data successfully",
        data: results,
      });
    } else {
      return res.status(500).json({
        message:"Internal Server error"
      });
    }
  });
};

// update-member-data

exports.memberDataUpdate = (req, res) => {
  let member = req.body;
  let query =
    "update  create_member set m_name=?, m_phone=?, m_add=?,m_email=?,m_state=?,m_dob=?,m_quali=?,m_gender=? where m_userid=? ";
  connection.query(
    query,
    [
      member.m_name,
      member.m_phone,
      member.m_add,
      member.m_email,
      member.m_state,
      member.m_dob,
      member.m_quali,
      member.m_gender,
      member.m_userid,
    ],
    (err, results) => {
      if (!err) {
        return res.status(200).json({
          message: "member Updated successfully",
        });
      } else {
        return res.status(500).json(err);
      }
    }
  );
};

//Member Bank data Update
exports.memberBankDataUpdate = (req, res) => {
  let member = req.body;
  let query =
    "update  member_bank_details set holder_name=?, account_no=?, ifsc_code=?,branch_name=?,bank_name=? where user_id=? ";
  connection.query(
    query,
    [
      member.holder_name,
      member.account_no,
      member.ifsc_code,
      member.branch_name,
      member.bank_name,
      member.user_id,
    ],
    (err, results) => {
      if (!err) {
        return res.status(200).json({
          message: "member Bank Details Updated successfully",
        });
      } else {
        return res.status(500).json(err);
      }
    }
  );
};

// Fetch Member Refferal ID

exports.fetchMemberRefferalId = (req, res) => {
  const memberid = req.body;
  let query = "select reffer_id from create_member where m_userid = ?";
  connection.query(query, [memberid.m_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Refferal ID successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

//fetch Member MyTeam

exports.fetchMemberMyTeam = (req, res) => {
  const memberId = req.body;
  let query =
    "select m_name,m_userid,m_doj from create_member where m_refferid = ?";
  connection.query(query, [memberId.m_refferid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched My Team data successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetch-member-myteam-details-from-partner

exports.fetchMemberMyteamDetailsFromPartner = (req, res) => {
  const memberId = req.body;
  let query =
    "select p_name,p_userid,p_dop from mining_partner  join create_member on mining_partner.p_reffered_id = create_member.reffer_id ";
  connection.query(query, [memberId.reffer_id], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched My Team from Partner data successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetch-member-wallet-daily-history

exports.fetchMemberWalletDailyHistory = (req, res) => {
  const memberId = req.body;
  let query = "select * from member_wallet_history where m_userid = ?";
  connection.query(query, [memberId.m_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched member Wallet Daily data successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

//fetch-sum-of-member-wallet-for-month

exports.fetchSumOfMemberWalletForMonth = (req, res) => {
  const memberId = req.body;
  let query = "select * from member_withdrawal where m_userid = ?";
  connection.query(query, [memberId.m_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched member total Wallet data successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

//fetch-sum-of-member-wallet-of-month

exports.fetchSumOfMemberWalletOfMonth = (req, res) => {
  const memberId = req.body;
  let query =
    "select sum(member_wallet) as sumOfMemberWallet  from  member_reffer_wallet_history where m_userid =?";
  connection.query(query, [memberId.m_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Sum Of Member Wallet Of One Month successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

//fetch-member-approve-withdrawal-history-for-member

exports.fetchMemberApproveWithdrawalHistoryForMember = (req, res) => {
  const memberId = req.body;
  let query =
    "select * from member_reffer_withdrawal_history where m_userid = ? ";
  connection.query(query, [memberId.m_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message:
          "Fetched Member Withdrawal History for Particular Member successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

//fetch-sum-of-member-total-withdrawal-for-member

exports.fetchSumOfMemberTotalWithdrawalForMember = (req, res) => {
  const memberId = req.body;
  let query =
    "select sum(member_wallet) as sumOfMemberWallet from  member_reffer_withdrawal_history where m_userid = ? ";
  connection.query(query, [memberId.m_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Sum of Member Withdrawal Amount successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

//fetch-member-withdrawal-request

exports.fetchMemberWithdrawalRequest = (req, res) => {
  const memberId = req.body;
  let query = "select * from member_reffer_withdrawal where m_userid = ? ";
  connection.query(query, [memberId.m_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Member Withdrawal Request successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// forget-password-member

exports.forgetPasswordMember = (req, res) => {
  const memberId = req.body;

  if (!memberId.m_userid) {
    return res.status(400).json({ message: "Field Missing" });
  }
  let query = "select m_phone from create_member where m_userid = ? ";
  connection.query(query, [memberId.m_userid], (err, results) => {
    const phone = results[0]?.m_phone;

    if (results.length > 0) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      let updatequery = "update create_member set otp =? where m_userid = ?";

      connection.query(
        updatequery,
        [otp, memberId.m_userid],
        (err, results) => {
          if (!err) {
            forgetpasswordSms(phone, {
              type: "Member",
              userid: memberId.m_userid,
              otp: otp,
            });
            res.status(201).json({ message: "otp sent" });
          }
        }
      );
    } else {
      return res.status(422).json({
        message: "Enter a valid user id",
      });
    }
  });
};

// verify otp
exports.verifyOtp = (req, res) => {
  const memberId = req.body;
  console.log(memberId.m_userid, memberId.otp);

  if (!memberId.m_userid || !memberId.otp) {
    return res.status(400).json({ message: "Field Missing" });
  }
  let query = "select otp from create_member where m_userid = ? ";
  connection.query(query, [memberId.m_userid], (err, results) => {
    if (!err) {
      const otp = results[0]?.otp;

      if (results.length > 0) {
        //res.status(200).json({message:"otp",otp})
        if (memberId.otp === otp) {
          res.status(200).json({ message: "matched" });
        } else {
          return res.status(400).json({ message: "Not Matched" });
        }
      } else {
        return res.status(422).json({
          message: "Something went wrong!",
        });
      }
    } else {
      return res.status(500).json({
        message: "Something went wrong!",
      });
    }
  });
};

// member-Regenerate-Password
exports.memberRegeneratePassword = (req, res) => {
  const memberId = req.body;
  const password = memberId.m_password;

  if (!memberId.m_userid || memberId.m_password) {
    return res.status(400).json({ message: "Field Missing" });
  }
  selectquery = "select m_phone from create_member where m_userid = ?";
  connection.query(selectquery, [memberId.m_userid], (err, result) => {
    if (!err) {
      phone = result[0]?.m_phone;
    }

    bcrypt.hash(memberId.m_password, 10, function (err, result) {
      if (err) {
        throw err;
      }
      hash = result;
      //console.log(hash);

      updatequery =
        "update create_member set m_password = ? where m_userid = ?";
      connection.query(
        updatequery,
        [hash, memberId.m_userid],
        (err, results) => {
          if (!err) {
            sms(phone, {
              type: "Member",
              userid: memberId.m_userid,
              password: password,
            });

            return res.status(200).json({
              message: "Password Reset Successfully",
            });
          } else {
            return res.status(500).json(err);
          }
        }
      );
    });
  });
};

// fetchRefferalPartnerDetailsFromMember
exports.fetchRefferalPartnerDetailsFromMember = (req, res) => {
  let partnerid = req.body;

  let query =
    "SELECT p_liquidity,p_dop,month_count,partner_status,p_name,partner_count from mining_partner where p_userid = ? ";
  connection.query(query, [partnerid.p_userid], (err, results) => {
    try {
      if (!err) {
        return res.status(200).json({
          message: "Fetched Partner Status Successfully ",
          data: results,
        });
      } else {
        return res.status(500).json(err);
      }
    } catch (error) {
      return res.error;
    }
  });
};

// fetchMemberLastPayout
exports.fetchMemberLastPayout = (req, res) => {
  const memberId = req.body;
  let query =
    "select * from member_reffer_withdrawal_history where reffer_p_userid = ? ";
  connection.query(query, [memberId.m_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Member Last payout successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchLiquidityForMemberSummary
exports.fetchLiquidityForMemberSummary = (req, res) => {
  const memberId = req.body;
  let query = "select p_liquidity from mining_partner where p_userid = ? ";
  connection.query(query, [memberId.p_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Partner Liquidity successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

exports.updateMember = async (req, res) => {
  try {
    const {
      m_name,
      m_lname,
      m_add,
      m_phone,
      m_email,
      m_gender,
      m_userid,
      m_state,
    } = req.body;

    // Check for required fields
    if (!m_name || !m_lname || !m_add || !m_phone || !m_email || !m_gender || !m_state || !m_userid) {
      return res.status(400).json({
        message: "All fields (m_name, m_lname, m_add, m_phone, m_email, m_gender, m_state, m_userid) are required.",
      });
    }

    // Validate name format
    if (!isValidName(m_name) || !isValidName(m_lname)) {
      return res.status(422).json({
        message: "Invalid name format. Name and last name should be valid names.",
      });
    }

    // Validate phone number format
    if (!isValidPhone(m_phone)) {
      return res.status(422).json({
        message: "Invalid phone number format. Use 10 digits or include a country code.",
      });
    }

    // Validate email format
    if (!isValidEmail(m_email)) {
      return res.status(422).json({
        message: "Invalid email format.",
      });
    }

    // Construct the SQL query to update the member
    const updateMemberQuery =
      "UPDATE create_member SET m_name=?, m_lname=?, m_email=?, m_phone=?, m_add=?, m_gender=?, m_state=? WHERE m_userid=?";

    // Execute the SQL query to update the member
    connection.query(
      updateMemberQuery,
      [m_name, m_lname, m_email, m_phone, m_add, m_gender, m_state, m_userid],
      (error, result) => {
        if (error) {
          console.error("Error executing SQL query:", error.message);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows === 1) {
          const updatedData = {
            m_name,
            m_lname,
            m_email,
            m_phone,
            m_add,
            m_gender,
            m_state,
            m_userid,
          };

          res.status(200).json({
            message: "Member updated successfully",
            updatedData: updatedData,
          });
        } else {
          res.status(404).json({ message: "Member not found" });
        }
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.memberWithdrawalRequest = async(req,res) => {
  const {memberId,amount,bank} = req.body;
  let query = "select member_wallet from create_member where m_userid = ? ";
  connection.query(query, [memberId], (err, results) => {
    if(err){
      return res
      .status(500)
      .json({ message: "Internal server error." });
    }
    if(results.length > 0){
      const memberWallet = results[0]?.member_wallet;
      // console.log(memberWallet)
      const updatedWallet = memberWallet-amount
      const date = new Date();
      // console.log(updatedWallet,635)
      const updateQuery = "update create_member set member_wallet = ? where m_userid = ?";
      connection.query(updateQuery,[updatedWallet,memberId],
        (err, results) => {
          if(err){
            return res
            .status(500)
            .json({ message: "Internal server error." });
          }else{
            // let insertQuery = "insert into member_withdrawal(m_userid,member_wallet,request_date) values(?,?,?)"
            let insertQuery = "insert into payment_request (userId,amount,requestDate,paymentBy) values(?,?,?,?)";
            connection.query(insertQuery,[memberId,amount,date,bank],(error,result) => {
              if (error) {
                return res
                  .status(500)
                  .json({ message: "Internal server error." });
              }else{
                return res
                .status(200)
                .json({ message: "Withdrawal request placed successfully" });
              }
            })
          }
        })
    }
  })
}



