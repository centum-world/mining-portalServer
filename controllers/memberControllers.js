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

// exports.memberLogin = async (req, res) => {
//   const { m_userid, m_password } = req.body;

//   try {
//     const query = "SELECT m_userid, m_password, reffer_id FROM create_member WHERE m_userid=?";
//     const [results] = await connection.promise().query(query, [m_userid]);

//     if (results.length > 0) {
//       const passwordMatch = await bcrypt.compare(m_password, results[0].m_password);

//       if (passwordMatch) {
//         const response = {
//           m_userid: results[0].m_userid,
//           role: "member",
//         };

//         const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
//           expiresIn: "8h",
//         });

//         res.status(200).json({
//           token: accessToken,
//           message: "Successfully loggedIn",
//           data: results,
//         });
//       } else {
//         res.status(401).json({ message: "Incorrect username or password" });
//       }
//     } else {
//       res.status(401).json({ message: "Invalid Credentials" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

exports.memberLogin = async (req, res) => {
  const { m_userid, m_password } = req.body;

  try {
    // Check if required fields are missing
    if (!m_userid || !m_password) {
      return res
        .status(422)
        .json({ message: "Please provide user ID and password." });
    }

    const findMemberQuery = "SELECT * FROM create_member WHERE m_userid =?";

    const [member] = await connection
      .promise()
      .query(findMemberQuery, [m_userid]);

    if (!member || member.length === 0) {
      return res.status(400).json({ message: "Invalid User ID or password." });
    }

    if (member[0].priority === 0) {
      const findFranchiseQuery =
        "SELECT * FROM create_franchise WHERE franchiseId =?";

      const [franchise] = await connection
        .promise()
        .query(findFranchiseQuery, [m_userid]);

      if (franchise && franchise.length > 0 && franchise[0].priority === 1) {
        return res.status(400).json({
          message:
            "Now, you have become a Franchise. Please login from Franchise dashboard.",
        });
      }

      const findBMMQuery = "SELECT * FROM create_sho WHERE stateHandlerId =?";

      const [bmm] = await connection.promise().query(findBMMQuery, [m_userid]);

      if (bmm && bmm.length > 0 && bmm[0].priority === 1) {
        return res.status(400).json({
          message:
            "Now, you have become Business Marketing Manager. Please login from BMM dashboard.",
        });
      }

      return res
        .status(400)
        .json({ message: "You are upgraded or downgraded." });
    }

    const passwordMatch = await bcrypt.compare(
      m_password,
      member[0].m_password
    );

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid User ID or password." });
    }

    // Generate jwt token
    const token = jwt.sign(
      { m_userid: member[0].m_userid, role: "member" },
      process.env.ACCESS_TOKEN,
      { expiresIn: 28800 }
    );

    return res
      .status(200)
      .json({ message: "Login successfully", data: member, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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
exports.addMemberBankDetails = async (req, res) => {
  try {
    const bank = req.body;
    
    // Check if the user already has a bank account
    const existingBankQuery = "SELECT COUNT(*) AS count FROM bank_details WHERE user_id = ?";
    const existingBankResult = await connection.promise().query(existingBankQuery, [bank.user_id]);
    const existingBankCount = existingBankResult[0][0].count;

    if (existingBankCount > 0) {
      return res.status(400).json({
        message: "User already has a bank account.",
      });
    }

    const insertQuery =
      "INSERT INTO bank_details(user_id, holder_name, account_no, ifsc_code, branch_name, bank_name) VALUES (?, ?, ?, ?, ?, ?)";
    
    const results = await connection.promise().query(insertQuery, [
      bank.user_id,
      bank.holder_name,
      bank.account_no,
      bank.ifsc_code,
      bank.branch_name,
      bank.bank_name,
    ]);

    return res.status(200).json({
      message: "Bank Details Added successfully",
      data: results[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.editMemberBankDetails = async (req, res) => {
  try {
    const { user_id, holder_name, account_no, ifsc_code, branch_name, bank_name } = req.body;
    
    // Check if the user already has a bank account
    const existingBankQuery = "SELECT COUNT(*) AS count FROM bank_details WHERE user_id = ?";
    const [existingBankResult] = await connection.promise().query(existingBankQuery, [user_id]);
    const existingBankCount = existingBankResult[0].count;

    if (existingBankCount === 0) {
      return res.status(400).json({
        message: "User does not have a bank account. Add bank details first.",
      });
    }

    // Update bank details
    const updateQuery =
      "UPDATE bank_details SET holder_name = ?, account_no = ?, ifsc_code = ?, branch_name = ?, bank_name = ? WHERE user_id = ?";
    
    const [results] = await connection.promise().query(updateQuery, [
      holder_name,
      account_no,
      ifsc_code,
      branch_name,
      bank_name,
      user_id,
    ]);

    return res.status(200).json({
      message: "Bank Details Updated successfully",
      data: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
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
        message: "Internal Server error",
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
  const { memberId } = req.body;
  let query = "select * from payment_approve where userId = ? ";
  connection.query(query, [memberId], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: " Member Withdrawal History Fetched Successfully ",
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
  const { memberId } = req.body;
  let query = "select * from payment_request where userId = ? ";
  connection.query(query, [memberId], (err, results) => {
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
    "SELECT p_liquidity,p_dop,month_count,partner_status,p_name,p_lname,partner_count from mining_partner where p_userid = ? ";
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
    if (
      !m_name ||
      !m_lname ||
      !m_add ||
      !m_phone ||
      !m_email ||
      !m_gender ||
      !m_state ||
      !m_userid
    ) {
      return res.status(400).json({
        message:
          "All fields (m_name, m_lname, m_add, m_phone, m_email, m_gender, m_state, m_userid) are required.",
      });
    }

    // Validate name format
    if (!isValidName(m_name) || !isValidName(m_lname)) {
      return res.status(422).json({
        message:
          "Invalid name format. Name and last name should be valid names.",
      });
    }

    // Validate phone number format
    if (!isValidPhone(m_phone)) {
      return res.status(422).json({
        message:
          "Invalid phone number format. Use 10 digits or include a country code.",
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

exports.memberWithdrawalRequest = async (req, res) => {
  const { memberId, amount, bank } = req.body;
  let query = "select member_wallet from create_member where m_userid = ? ";
  connection.query(query, [memberId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error." });
    }
    if (results.length > 0) {
      const memberWallet = results[0]?.member_wallet;
      const updatedWallet = memberWallet - amount;
      const date = new Date();
      const updateQuery =
        "update create_member set member_wallet = ? where m_userid = ?";
      connection.query(
        updateQuery,
        [updatedWallet, memberId],
        (err, results) => {
          if (err) {
            return res.status(500).json({ message: "Internal server error." });
          } else {
            // let insertQuery = "insert into member_withdrawal(m_userid,member_wallet,request_date) values(?,?,?)"
            let insertQuery =
              "insert into payment_request (userId,amount,requestDate,paymentBy) values(?,?,?,?)";
            connection.query(
              insertQuery,
              [memberId, amount, date, bank],
              (error, result) => {
                if (error) {
                  return res
                    .status(500)
                    .json({ message: "Internal server error." });
                } else {
                  return res.status(200).json({
                    message: "Withdrawal request placed successfully",
                  });
                }
              }
            );
          }
        }
      );
    }
  });
};

// fetchUpgradedMember
exports.fetchUpgradedMember = async (req, res) => {
  let query =
    "select * FROM create_member WHERE isVerify = 0 AND priority = 0  ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "All upgrade/downgrade Member Fetched successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

exports.fetchMemberWallet = async (req, res) => {
  try {
    const { m_userid } = req.body;
    let query = "select member_wallet FROM create_member WHERE m_userid = ? ";
    connection.query(query, [m_userid], (err, results) => {
      if (!err) {
        return res.status(200).json({
          message: "member wallet fetched successfully",
          data: results,
        });
      } else {
        return res.status(500).json(err);
      }
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.totalCountPartner = async (req, res) => {
  try {
    const { referralId } = req.body;

    // Validate referralId
    if (!referralId) {
      return res.status(400).json({ message : "Referral ID is required." });
    }

    // Fetch total Partner count
    const totalPartnerQuery =
      "SELECT COUNT(*) AS totalPartnerCount FROM mining_partner WHERE isVerify = 1 AND p_reffered_id = ?";
    const totalPartnerResult = await connection
      .promise()
      .query(totalPartnerQuery, [referralId]);

    // Check if referralId is found
    if (totalPartnerResult[0][0].totalPartnerCount === 0) {
      return res.status(404).json({ message: "Referral ID not found in mining_partner." });
    }

    // Fetch today's Partner count
    const todayPartnerQuery =
      "SELECT COUNT(*) AS todayPartnerCount FROM mining_partner WHERE isVerify = 1 AND p_reffered_id = ? AND DATE(verifyDate) = CURDATE()";
    const todayPartnerResult = await connection
      .promise()
      .query(todayPartnerQuery, [referralId]);

    // Process results and return
    return res.status(200).json({
      totalPartnerCount: totalPartnerResult[0][0].totalPartnerCount,
      todayPartnerCount: todayPartnerResult[0][0].todayPartnerCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.fetchMemberTodaysAndTotalPayout = async (req, res) => {
  try {
    const { currentDate, currentMonth, currentYear, userid } = req.body;
    const [year, month, day] = currentDate.split('-');

    let fetchTransactionQuery = "SELECT ";
    fetchTransactionQuery += "SUM(CASE WHEN DAY(credit_date) = ? THEN amount ELSE 0 END) AS totalAmountToday, ";
    fetchTransactionQuery += "SUM(CASE WHEN MONTH(credit_date) = ? THEN amount ELSE 0 END) AS totalAmountCurrentMonth ";
    fetchTransactionQuery += "FROM my_team WHERE userid = ? AND YEAR(credit_date) = ?";

    const queryParams = [day, month, userid, year];

    const [transactionHistory] = await connection
      .promise()
      .query(fetchTransactionQuery, queryParams);

    if (!transactionHistory || transactionHistory.length === 0) {
      return res.status(200).json({
        message: "No Payout History Found",
        data: {
          totalAmountToday: 0,
          totalAmountCurrentMonth: 0
        },
      });
    }

    let fetchTotalPayoutQuery = "SELECT ";
    fetchTotalPayoutQuery += "SUM(amount) AS totalAmount ";
    fetchTotalPayoutQuery += "FROM my_team WHERE userid = ?";

    const totalPayoutParams = [userid];

    const [totalPayoutResult] = await connection
      .promise()
      .query(fetchTotalPayoutQuery, totalPayoutParams);

    if (!totalPayoutResult || totalPayoutResult.length === 0) {
      return res.status(200).json({
        message: "No Total Payout Found",
        data: {
          totalAmount: 0
        },
      });
    }

    return res.status(200).json({
      message: "Payout with total found successfully",
      data: {
        totalAmountToday: transactionHistory[0].totalAmountToday || 0,
        totalAmountCurrentMonth: transactionHistory[0].totalAmountCurrentMonth || 0,
        totalPayout: totalPayoutResult[0].totalAmount || 0
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};




