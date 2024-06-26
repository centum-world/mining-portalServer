const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const email = require("../utils/withdrawal-email");
const sms = require("../utils/successfull-add-sms");
const withdrawalSms = require("../utils/partner-month-approve-amount-sms");
const memberWithdrawalSms = require("../utils/member-month-approve-amount-sms");
const walletSms = require("../utils/wallet-amount-sms");
const memberWalletSms = require("../utils/member-wallet-amount-sms");
const doPartnerActivateSms = require("../utils/partner-activate-sms");
require("dotenv").config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const connection = require("../config/database");
const { query, response } = require("express");
const bcrypt = require("bcrypt");
const { queryAsync } = require("../utils/utility");
const { log } = require("console");
const moment = require("moment");
const internal = require("stream");

// admin Login

exports.adminLogin = (req, res) => {
  let admin = req.body;
  let query =
    "select user_id, password, reffer_id from admin_login where user_id=?";
  connection.query(query, [admin.user_id], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != admin.password) {
        return res
          .status(401)
          .json({ message: "Incorrect username or password" });
      } else if (results[0].password == admin.password) {
        const response = { user_id: results[0].user_id, role: "admin" };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "8h",
        });
        res.status(200).json({
          token: accessToken,
          message: "Successfully logedIn",
          data: results,
        });
      } else {
        return res.status(400).json({ message: "Login Failed" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
};

// create member

exports.createMember = (req, res) => {
  let member = req.body;
  let firstname = req.body.m_name;
  let lastname = req.body.m_lname;
  let reffer_id = "";
  const firstCharf = firstname.charAt(0).toUpperCase();
  const firstCharl = lastname.charAt(0).toUpperCase();
  let hash = "";
  let selectRefferid = " select reffer_id from create_member";
  connection.query(selectRefferid, (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        reffer_id = firstCharf + "" + firstCharl + "" + 9001;
        let query = "select * from create_member where m_userid = ?";
        connection.query(query, [member.m_userid], (err, results) => {
          if (!err) {
            if (results.length <= 0) {
              let password = member.m_password;

              bcrypt.hash(member.m_password, 10, function (err, result) {
                if (err) {
                  throw err;
                }
                hash = result;
                let query =
                  "insert into create_member (m_name,m_lname, m_phone, m_add, m_refferid, m_state, m_email, m_designation, m_quali, m_gender, m_exp, m_salary,m_dob, m_doj , m_userid, m_password, reffer_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                connection.query(
                  query,
                  [
                    member.m_name,
                    member.m_lname,
                    member.m_phone,
                    member.m_add,
                    member.m_refferid,
                    member.m_state,
                    member.m_email,
                    member.m_designation,
                    member.m_quali,
                    member.m_gender,
                    member.m_exp,
                    member.m_salary,
                    member.m_dob,
                    member.m_doj,
                    member.m_userid,
                    hash,
                    reffer_id,
                  ],
                  (err, results) => {
                    if (!err) {
                      sms(member.m_phone, {
                        type: "Member",
                        userid: member.m_userid,
                        password: password,
                      });

                      return res.status(200).json({
                        message: "Member added successfully",
                      });
                    } else {
                      return res.status(500).json(err);
                    }
                  }
                );
              });
            } else {
              return res.status(400).json({
                message: "User ID already exist ! ",
              });
            }
          } else {
            return res.status(500).json(err);
          }
        });
      } else {
        let reffer_id_length = results.length;
        let findLastFourChar = results[reffer_id_length - 1].reffer_id;
        let lastFourChars = findLastFourChar.slice(-4);
        const num = parseInt(lastFourChars);
        reffer_id = firstCharf + "" + firstCharl + "" + (num + 1);

        let query = "select * from create_member where m_userid = ?";
        connection.query(query, [member.m_userid], (err, results) => {
          if (!err) {
            if (results.length <= 0) {
              let password = member.m_password;

              bcrypt.hash(member.m_password, 10, function (err, result) {
                if (err) {
                  throw err;
                }
                hash = result;
                let query =
                  "insert into create_member (m_name,m_lname, m_phone, m_add, m_refferid, m_state, m_email, m_designation, m_quali, m_gender, m_exp, m_salary,m_dob, m_doj , m_userid, m_password, reffer_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                connection.query(
                  query,
                  [
                    member.m_name,
                    member.m_lname,
                    member.m_phone,
                    member.m_add,
                    member.m_refferid,
                    member.m_state,
                    member.m_email,
                    member.m_designation,
                    member.m_quali,
                    member.m_gender,
                    member.m_exp,
                    member.m_salary,
                    member.m_dob,
                    member.m_doj,
                    member.m_userid,
                    hash,
                    reffer_id,
                  ],
                  (err, results) => {
                    if (!err) {
                      sms(member.m_phone, {
                        type: "Member",
                        userid: member.m_userid,
                        password: password,
                      });

                      return res.status(200).json({
                        message: "Member added successfully",
                      });
                    } else {
                      return res.status(500).json(err);
                    }
                  }
                );
              });
            } else {
              return res.status(400).json({
                message: "User ID already exist ! ",
              });
            }
          } else {
            return res.status(500).json(err);
          }
        });
      }
    }
  });

  // let query = "select * from create_member where m_userid = ?";
  // connection.query(query, [member.m_userid], (err, results) => {

  //     if (!err) {
  //         if (results.length <= 0) {
  //             let password = member.m_password;

  //             bcrypt.hash(member.m_password, 10, function (err, result) {
  //                 if (err) {
  //                     throw (err);
  //                 }
  //                 hash = result;
  //                 let query = "insert into create_member (m_name,m_lname, m_phone, m_add, m_refferid, m_state, m_email, m_designation, m_quali, m_gender, m_exp, m_salary,m_dob, m_doj , m_userid, m_password, reffer_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  //                 connection.query(query, [member.m_name, member.m_lname, member.m_phone, member.m_add,
  //                 member.m_refferid, member.m_state, member.m_email, member.m_designation,
  //                 member.m_quali, member.m_gender, member.m_exp,
  //                 member.m_salary, member.m_dob, member.m_doj, member.m_userid,
  //                     hash, member.reffer_id], (err, results) => {
  //                         if (!err) {

  //                             sms(member.m_phone, { "type": 'Member', "userid": member.m_userid, "password": password })

  //                             return res.status(200).json({
  //                                 message: "Member added successfully"
  //                             });
  //                         } else {
  //                             return res.status(500).json(err);
  //                         }
  //                     });
  //             });

  //         } else {
  //             return res.status(400).json({
  //                 message: "User ID already exist ! "
  //             })
  //         }
  //     } else {
  //         return res.status(500).json(err);
  //     }
  // });
};

//  fetch Member

exports.fetchMember = (req, res) => {
  //const token = req.body;
  let query = "select *from create_member";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched data successfully",
        memberData: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// create-mining-partner

exports.createMiningPartner = (req, res) => {
  let partner = req.body;
  let firstname = req.body.p_name;
  let lastname = req.body.p_lname;
  const firstCharf = firstname.charAt(0).toUpperCase();
  const firstCharl = lastname.charAt(0).toUpperCase();

  let p_refferal_id = "";

  let selectrefferid = "select p_refferal_id from mining_partner ";
  connection.query(selectrefferid, (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        p_refferal_id = firstCharf + "" + firstCharl + "" + 9050;
        let selectquery = " select * from mining_partner where p_userid = ?";
        connection.query(selectquery, [partner.p_userid], (err, results) => {
          if (!err) {
            if (results.length <= 0) {
              let password = partner.p_password;

              bcrypt.hash(partner.p_password, 10, function (err, result) {
                if (err) {
                  throw err;
                }
                hash = result;
                let query =
                  "insert into mining_partner(p_reffered_id ,p_name,p_lname ,p_aadhar,p_phone,p_email,p_address,p_state,p_dob,p_nominee_name,p_nominee_aadhar,p_nominee_phone,p_dop,p_liquidity, terms,p_userid,p_password, p_refferal_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                connection.query(
                  query,
                  [
                    partner.p_reffered_id,
                    partner.p_name,
                    partner.p_lname,
                    partner.p_aadhar,
                    partner.p_phone,
                    partner.p_email,
                    partner.p_address,
                    partner.p_state,
                    partner.p_dob,
                    partner.p_nominee_name,
                    partner.p_nominee_aadhar,
                    partner.p_nominee_phone,
                    partner.p_dop,
                    partner.p_liquidity,
                    partner.terms,
                    partner.p_userid,
                    hash,
                    p_refferal_id,
                  ],
                  (err, results) => {
                    if (!err) {
                      sms(partner.p_phone, {
                        type: "Partner",
                        userid: partner.p_userid,
                        password: password,
                      });
                      return res.status(200).json({
                        message: "mining partner added successfully",
                      });
                    } else {
                      return res.status(500).json(err);
                    }
                  }
                );
              });
            } else {
              return res.status(400).json({
                message: "Partner ID already exist!",
              });
            }
          } else {
            return res.status(500).json(err);
          }
        });
      } else {
        let reffer_id_length = results.length;
        let findLastFourChar = results[reffer_id_length - 1].p_refferal_id;
        let lastFourChars = findLastFourChar.slice(-4);
        const num = parseInt(lastFourChars);
        p_refferal_id = firstCharf + "" + firstCharl + "" + (num + 1);
        let selectquery = " select * from mining_partner where p_userid = ?";
        connection.query(selectquery, [partner.p_userid], (err, results) => {
          if (!err) {
            if (results.length <= 0) {
              let password = partner.p_password;

              bcrypt.hash(partner.p_password, 10, function (err, result) {
                if (err) {
                  throw err;
                }
                hash = result;
                let query =
                  "insert into mining_partner(p_reffered_id ,p_name,p_lname ,p_aadhar,p_phone,p_email,p_address,p_state,p_dob,p_nominee_name,p_nominee_aadhar,p_nominee_phone,p_dop,p_liquidity, terms,p_userid,p_password, p_refferal_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                connection.query(
                  query,
                  [
                    partner.p_reffered_id,
                    partner.p_name,
                    partner.p_lname,
                    partner.p_aadhar,
                    partner.p_phone,
                    partner.p_email,
                    partner.p_address,
                    partner.p_state,
                    partner.p_dob,
                    partner.p_nominee_name,
                    partner.p_nominee_aadhar,
                    partner.p_nominee_phone,
                    partner.p_dop,
                    partner.p_liquidity,
                    partner.terms,
                    partner.p_userid,
                    hash,
                    p_refferal_id,
                  ],
                  (err, results) => {
                    if (!err) {
                      sms(partner.p_phone, {
                        type: "Partner",
                        userid: partner.p_userid,
                        password: password,
                      });
                      return res.status(200).json({
                        message: "mining partner added successfully",
                      });
                    } else {
                      return res.status(500).json(err);
                    }
                  }
                );
              });
            } else {
              return res.status(400).json({
                message: "Partner ID already exist!",
              });
            }
          } else {
            return res.status(500).json(err);
          }
        });
      }
    }
  });

  // let selectquery = " select * from mining_partner where p_userid = ?";
  // connection.query(selectquery, [partner.p_userid], (err, results) => {

  //     if (!err) {
  //         if (results.length <= 0) {

  //             let password = partner.p_password;

  //             bcrypt.hash(partner.p_password, 10, function (err, result) {
  //                 if (err) {
  //                     throw (err);
  //                 }
  //                 hash = result;
  //                 let query = "insert into mining_partner(p_reffered_id ,p_name,p_lname ,p_aadhar,p_phone,p_email,p_address,p_state,p_dob,p_nominee_name,p_nominee_aadhar,p_nominee_phone,p_dop,p_liquidity, terms,p_userid,p_password, p_refferal_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  //                 connection.query(query, [partner.p_reffered_id, partner.p_name,partner.p_lname, partner.p_aadhar,
  //                 partner.p_phone, partner.p_email, partner.p_address, partner.p_state, partner.p_dob, partner.p_nominee_name,
  //                 partner.p_nominee_aadhar, partner.p_nominee_phone, partner.p_dop, partner.p_liquidity,
  //                 partner.terms, partner.p_userid, hash, partner.p_refferal_id], (err, results) => {
  //                     if (!err) {

  //                         sms(partner.p_phone, { "type": 'Partner', "userid": partner.p_userid, "password": password })
  //                         return res.status(200).json({
  //                             message: "mining partner added successfully"
  //                         });
  //                     } else {
  //                         return res.status(500).json(err);
  //                     }
  //                 });

  //             })

  //         } else {
  //             return res.status(400).json({
  //                 message: "Partner ID already exist!"
  //             })
  //         }
  //     } else {
  //         return res.status(500).json(err);
  //     }
  // });
};

// fetch-mining-partner

exports.fetchMiningPartner = (req, res) => {
  let query = "select *from mining_partner";
  connection.query(query, (err, results) => {
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

// fetch-all-partner-total-wallet-amount-for admin who is active

exports.fetchAllPartnerTotalWalletAmountFromAdmin = (req, res) => {
  //const partnerId = req.body;
  let query = "select * from partner_wallet_history ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched  All Partner Wallet Daily data successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetch-sum-of-all-partner-liquidity

exports.fetchSumOfAllPartnerLiquidity = (req, res) => {
  //const partnerId = req.body;
  let query =
    "select sum(p_liquidity) as sumofliquidity  from mining_partner where partner_status = '1' OR month_count = '11'";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Sum Of All Partner Liquidity successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetch-all-active-partner-only

exports.fetchAllActivePartnerOnly = (req, res) => {
  let query =
    "SELECT p_userid, p_name, p_lname, p_phone, p_reffered_id, p_dop, p_liquidity, partner_status, month_count FROM mining_partner WHERE (partner_status = '1' OR month_count='11') OR (partner_status = '0' AND month_count = '12')";

  connection.query(query, async (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    try {
      for (const partner of results) {
        const userId = partner.p_userid;
        const multipleRigPartnerQuery = "SELECT liquidity FROM multiple_rig_partner WHERE userId = ?";
        const [rigResults] = await connection.promise().query(multipleRigPartnerQuery, [userId]);

        // Calculate total liquidity for the partner
        const totalLiquidity = rigResults.reduce((total, rig) => total + rig.liquidity, 0) + partner.p_liquidity;

        // Add total liquidity to the partner object
        partner.total_liquidity = totalLiquidity;
      }

      return res.status(200).json({
        message: "Fetched All Active Partners Only successfully",
        data: results,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};


// fetch-partner-withdrawal-request-to-admin

exports.fetchPartnerWithdrawalRequestToAdmin = (req, res) => {
  //const partnerId = req.body;
  let query =
    "select p_userid,partner_wallet,request_date,id from partner_withdrawal ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Partner Withdrawal Request  data successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// Approve Partner Withdrawal Request

exports.approvePartnerWithdrawalRequest = (req, res) => {
  let partnerId = req.body;
  let query =
    "select partner_wallet,request_date,p_userid from partner_withdrawal where id = ? ";
  connection.query(query, [partnerId.id], (err, results) => {
    if (!err) {
      let partner_wallet = results[0]?.partner_wallet;
      let id = results[0]?.id;
      let request_date = results[0]?.request_date;
      let approve_date = new Date();
      let p_userid = results[0]?.p_userid;
      let insertquery =
        "insert into partner_withdrawal_history (partner_wallet,request_date,approve_date,p_userid) values (?,?,?,?)";
      connection.query(
        insertquery,
        [partner_wallet, request_date, approve_date, partnerId.p_userid],
        (err, results) => {
          if (!err) {
            let selectquery =
              "select p_email,p_phone from mining_partner where p_userid = ?";
            connection.query(
              selectquery,
              [partnerId.p_userid],
              (err, results) => {
                if (!err) {
                  partnerEmail = results[0]?.p_email;
                  partnerPhone = results[0]?.p_phone;
                  // withdrawalSms(partnerPhone, { "type": 'Partner', "userid": partnerId.p_userid, "amount": partner_wallet })

                  email(partnerEmail, {
                    withdrawalAmount: partner_wallet,
                    userId: partnerId.p_userid,
                  });
                }
                // else {
                //     return res.status(500).json({
                //         message: "Something Went Wrong"
                //     })
                // }
              }
            );

            let deletequery = "delete from partner_withdrawal where id = ?";
            connection.query(deletequery, [partnerId.id], (err, results) => {
              if (!err) {
                return res.status(200).json({
                  message: " Partner Withdrwal Request Approved",
                });
              }
            });
          } else {
            return res.status(500).json({
              message: "Something Went Wrong",
            });
          }
        }
      );
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetch-partner-approve-withdrawal-history

exports.fetchPartnerApproveWithdrawalHistory = (req, res) => {
  //const partnerId = req.body;
  let query = "select * from partner_withdrawal_history ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Partner Withdrawal History successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetch-sum-of-member-wallet-for-month-for-admin

exports.fetchSumOfMemberWalletForMonthForAdmin = (req, res) => {
  //const memberId = req.body;
  let query = "select * from member_wallet_history ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Sum of member wallet for Admin  successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetch-member-withdrawal-request-to-admin

exports.fetchMemberWithdrawalRequestToAdmin = (req, res) => {
  const { memberId } = req.body;
  let query = "select * from payment_request where userId = ? ";
  connection.query(query, [memberId], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Member Withdrawal Request to Admin successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetch-member-approve-withdrawal-history-for-admin

exports.fetchMemberApproveWithdrawalHistoryForAdmin = (req, res) => {
  //const partnerId = req.body;
  let query = "select * from member_withdrawal_history ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Member Withdrawal History successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// Fetch-Member-Profile-Details-From-Admin

exports.fetchMemberProfileDetailsFromAdmin = (req, res) => {
  let memberid = req.body;
  let query = "select * from create_member where m_userid = ?";
  connection.query(query, [memberid.m_userid], (err, results) => {
    try {
      if (!err) {
        return res.status(200).json({
          message: "Fetched Member Profile Details Successfully ",
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

// Update-Member-Profile-Details-From-Admin

exports.updateMemberProfileDetailsFromAdmin = (req, res) => {
  let memberId = req.body;
  let query =
    "update create_member set m_name=?, m_phone=?,m_email=?,m_add=?,m_state=?,m_salary=?,m_dob=?,m_doj=?,m_gender=?,m_exp=?,m_quali=?,m_designation=? where m_userid=? ";
  connection.query(
    query,
    [
      memberId.m_name,
      memberId.m_phone,
      memberId.m_email,
      memberId.m_add,
      memberId.m_state,
      memberId.m_salary,
      memberId.m_dob,
      memberId.m_doj,
      memberId.m_gender,
      memberId.m_exp,
      memberId.m_quali,
      memberId.m_designation,
      memberId.m_userid,
    ],
    (err, results) => {
      if (!err) {
        return res.status(200).json({
          message: "Member Profile Details Updated successfully",
        });
      } else {
        return res.status(500).json({
          message: err,
        });
      }
    }
  );
};

// fetch-Mining-partner-Profile-Details-From-Admin

exports.fetchMiningPartnerProfileDetailsFromAdmin = (req, res) => {
  let partnerId = req.body;
  let query = "select * from mining_partner where p_userid = ?";
  connection.query(query, [partnerId.p_userid], (err, results) => {
    try {
      if (!err) {
        return res.status(200).json({
          message: "Fetched Mining Partner Profile Details Successfully ",
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

//  update-mining-partner-profile-details-from-admin

exports.updateMiningPartnerProfileDetailsFromAdmin = (req, res) => {
  let partnerId = req.body;
  let query =
    "update mining_partner set p_name=?,l_name=?, p_aadhar=?,p_phone=?,p_email=?,p_address=?,p_state=?,p_nominee_name=?,p_nominee_aadhar=?,p_nominee_phone=?,p_dob=?,p_dop=?,p_liquidity=? where p_userid=? ";
  connection.query(
    query,
    [
      partnerId.p_name,
      partnerId.p_lname,
      partnerId.p_aadhar,
      partnerId.p_phone,
      partnerId.p_email,
      partnerId.p_address,
      partnerId.p_state,
      partnerId.p_nominee_name,
      partnerId.p_nominee_aadhar,
      partnerId.p_nominee_phone,
      partnerId.p_dob,
      partnerId.p_dop,
      partnerId.p_liquidity,
      partnerId.p_userid,
    ],
    (err, results) => {
      if (!err) {
        return res.status(200).json({
          message: "Mining Partner Profile Details Updated successfully",
        });
      } else {
        return res.status(500).json({
          message: err,
        });
      }
    }
  );
};

// approveMemberWithdrawalRequest

exports.approveMemberWithdrawalRequest = (req, res) => {
  let memberId = req.body;
  let query =
    "select member_wallet,request_date from member_withdrawal where id = ? ";
  connection.query(query, [memberId.id], (err, results) => {
    if (!err) {
      //
      let member_wallet = results[0]?.member_wallet;
      let request_date = results[0]?.request_date;
      let approve_date = new Date();
      let insertquery =
        "insert into member_withdrawal_history (member_wallet,request_date,approve_date,m_userid) values (?,?,?,?)";
      connection.query(
        insertquery,
        [member_wallet, request_date, approve_date, memberId.m_userid],
        (err, results) => {
          try {
            if (!err) {
              let selectquery =
                "select m_email,m_phone from create_member where m_userid =?";
              connection.query(
                selectquery,
                [memberId.m_userid],
                (err, results) => {
                  try {
                    if (!err) {
                      let memberEmail = results[0]?.m_email;
                      let memberPhone = results[0]?.m_phone;
                      memberWithdrawalSms(memberPhone, {
                        type: "Member",
                        userid: memberId.m_userid,
                        amount: member_wallet,
                      });

                      email(memberEmail, { withdrawalAmount: member_wallet });
                    } else {
                      return res.status(400).json(err);
                    }
                  } catch (error) {
                    return error;
                  }
                }
              );

              let deletequery = "delete from member_withdrawal where id = ?";
              connection.query(deletequery, [memberId.id], (err, results) => {
                try {
                  if (!err) {
                    return res.status(200).json({
                      message: " Member Withdrwal Request Approved",
                    });
                  } else {
                    return res.status(400).json(err);
                  }
                } catch (error) {
                  return error;
                }
              });
            } else {
              return res.status(400).json({
                message: "Not Approved",
              });
            }
          } catch (error) {
            return error;
          }
        }
      );
    } else {
      return res.status(404).json({
        message: "Something Went Wrong 1",
      });
    }
  });
};

// fetch-all-Pending-partner-only

exports.fetchAllPendingPartnerOnly = (req, res) => {
  //const partnerId = req.body;
  let query =
    "select p_userid,p_name,p_lname,p_phone,p_reffered_id,p_phone,p_liquidity from mining_partner where partner_status = '0' AND month_count='0'";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched All Pending Partner Only successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// isPartnerActiveManualFromAdmin
exports.isPartnerActiveManualFromAdmin = (req, res) => {
  let partnerid = req.body;

  let query =
    "SELECT p_liquidity,p_dop,month_count,partner_status,p_name from mining_partner where p_userid = ? ";
  connection.query(query, [partnerid.p_userid], (err, results) => {
    try {
      if (!err) {
        // let approve_date = results[0]?.approve_date;
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

exports.doActivatePartnerManualFromAdmin = async (req, res) => {
  try {
    const { p_userid, rigId, type } = req.body;
    console.log(p_userid);

    // Query to get rigId from mining_partner
    const partnerDetailsQuery =
      "SELECT rigId FROM mining_partner WHERE p_userid = ?";
    const [result] = await connection
      .promise()
      .query(partnerDetailsQuery, [p_userid]);
    const rigid = result[0]?.rigId;

    if (type === "onetime") {
      if (rigId === rigid) {
        console.log("first");
        // Update mining_partner status
        const updateMiningPartnerQuery =
          "UPDATE mining_partner SET partner_status = 1  WHERE p_userid = ?";
        await connection.promise().query(updateMiningPartnerQuery, [p_userid]);

        const selectPartnerQuery =
          "SELECT * FROM mining_partner WHERE p_userid = ?";
        const [miningPartnerResult] = await connection
          .promise()
          .query(selectPartnerQuery, [p_userid]);
        const miningPartner = miningPartnerResult[0];

        console.log(miningPartner, "partner");

        const liquidity = miningPartner.p_liquidity;
        console.log(liquidity, "liquidity");

        const referredIdOfPartner = miningPartner.p_reffered_id;
        console.log(referredIdOfPartner, "referredidOfPartner");

        const referralIdOfPartner = miningPartner.p_refferal_id;
        console.log(referralIdOfPartner, "referralIdOfpartner");

        let partnerWallet = miningPartner.partner_wallet;

        const findReferredPartnerQuery =
          "SELECT * FROM mining_partner WHERE p_refferal_id = ?";
        const [partnerReferredByPartner] = await connection
          .promise()
          .query(findReferredPartnerQuery, [referredIdOfPartner]);
        console.log(partnerReferredByPartner, 1413);

        const referredPartnerUserId = partnerReferredByPartner[0]?.p_userid;

        // Find member details if partner referred by member
        const findMemberQuery =
          "SELECT * FROM create_member WHERE reffer_id = ?";
        const [partnerReferredByMember] = await connection
          .promise()
          .query(findMemberQuery, [referredIdOfPartner]);
        console.log(partnerReferredByMember, "memberResult");

        //find frnachise details if partner referred By franchise
        const findFranchiseQuery =
          "SELECT * FROM create_franchise WHERE referralId = ?";

        const [partnerReferredByFranchise] = await connection
          .promise()
          .query(findFranchiseQuery, [referredIdOfPartner]);
        console.log(partnerReferredByFranchise, "franchise Result");

        if (partnerReferredByPartner.length > 0) {
          console.log("partner to partner");

          console.log(partnerWallet, 1422);
          partnerWallet += (liquidity * 82 * 10) / 10000;
          console.log(partnerWallet, 1424);

          // Update partner_wallet
          const partnerUpdatedWalletQuery =
            "UPDATE mining_partner SET partner_wallet = ? WHERE p_refferal_id = ?";
          await connection
            .promise()
            .query(partnerUpdatedWalletQuery, [
              partnerWallet,
              referredIdOfPartner,
            ]);

          const date = new Date();
          const userType = "PARTNER";

          // Insert into my_team table
          const insertIntoMyTeamQuery =
            "INSERT INTO my_team (userid, amount, partnerid, credit_date, userType) VALUES (?, ?, ?, ?, ?)";
          await connection
            .promise()
            .query(insertIntoMyTeamQuery, [
              referredPartnerUserId,
              partnerWallet,
              p_userid,
              date,
              userType,
            ]);
        } else if (
          partnerReferredByMember.length > 0 &&
          partnerReferredByMember[0].priority === 1
        ) {
          console.log("first condition chaining");
          const member = partnerReferredByMember[0];
          console.log(member, "member");

          let memberWallet = member.member_wallet;
          let referralIdOfMember = member.reffer_id;
          let referredIdOfMember = member.m_refferid;
          let memberid = member.m_userid;
          let target = member.target;
          let priority = member.priority;
          let userType = member.userType;
          const afterGstLiquidity = (liquidity * 18) / 100;
          const afterGstAmount = liquidity - afterGstLiquidity;
          const amount = (afterGstAmount * 10) / 100;
          memberWallet += (afterGstAmount * 10) / 100;
          target += liquidity;

          // Update member_wallet and target in create_member table
          const updateMemberWalletQuery =
            "UPDATE create_member SET member_wallet = ?, target = ? WHERE reffer_id = ?";
          await connection
            .promise()
            .query(updateMemberWalletQuery, [
              memberWallet,
              target,
              referralIdOfMember,
            ]);

          const date = new Date();

          // Insert into my_team table for member
          const insertIntoMyTeamQuery =
            "INSERT INTO my_team (userid, amount, partnerid, credit_date, userType) VALUES (?, ?, ?, ?, ?)";
          await connection
            .promise()
            .query(insertIntoMyTeamQuery, [
              memberid,
              amount,
              p_userid,
              date,
              userType,
            ]);

          // Find franchise details
          const findFranchiseQuery =
            "SELECT * FROM create_franchise WHERE referralId = ?";
          const [franchiseResult] = await connection
            .promise()
            .query(findFranchiseQuery, [referredIdOfMember]);

          if (franchiseResult.length > 0) {
            const franchise = franchiseResult[0];
            const referredIdOfFranchise = franchise.referredId;
            console.log(referredIdOfFranchise, "referredIdOfFranchise");
            let franchiseWallet = franchise.franchiseWallet;
            const franchiseid = franchise.franchiseId;
            const userType = franchise.userType;
            let netLiquidity = (liquidity * 82) / 100;
            const amount = (netLiquidity * 5) / 100;
            franchiseWallet += amount;

            // Update franchiseWallet in create_franchise table
            const updateFranchiseWalletquery =
              "UPDATE create_franchise SET franchiseWallet = ? WHERE referredId = ?";
            await connection
              .promise()
              .query(updateFranchiseWalletquery, [
                franchiseWallet,
                referredIdOfFranchise,
              ]);

            // Insert into my_team table for franchise
            const insertFranchiseIntoMyTeam =
              "INSERT INTO my_team (userid, amount, partnerid, credit_date, userType) VALUES (?, ?, ?, ?, ?)";
            await connection
              .promise()
              .query(insertFranchiseIntoMyTeam, [
                franchiseid,
                amount,
                p_userid,
                date,
                userType,
              ]);
          }

          // Find BMM details
          const findBMMQuery = "SELECT * FROM create_sho WHERE referralId = ?";
          const [bmmResult] = await connection
            .promise()
            .query(findBMMQuery, [franchiseResult[0].referredId]);

          console.log(bmmResult[0], 1552, "bmmresult");

          if (bmmResult.length > 0) {
            const bmm = bmmResult[0];
            const referralIdOfBmm = bmm.referralId;
            let stateHandlerWallet = bmm.stateHandlerWallet;
            const bmmId = bmm.stateHandlerId;
            const userType = bmm.userType;
            let netLiquidity = (liquidity * 82) / 100;
            const amount = (netLiquidity * 5) / 100;
            stateHandlerWallet += amount;

            // Update stateHandlerWallet in create_sho table
            const updateBmmWalletQuery =
              "UPDATE create_sho SET stateHandlerWallet = ? WHERE referralId = ?";
            await connection
              .promise()
              .query(updateBmmWalletQuery, [
                stateHandlerWallet,
                referralIdOfBmm,
              ]);

            // Insert into
            const insertBmmIntoMyTeam =
              "INSERT INTO my_team (userid, amount, partnerid, credit_date, userType) VALUES (?, ?, ?, ?, ?)";
            await connection
              .promise()
              .query(insertBmmIntoMyTeam, [
                bmmId,
                amount,
                p_userid,
                date,
                userType,
              ]);
          }
        } else if (
          partnerReferredByFranchise.length > 0 &&
          partnerReferredByFranchise[0].priority === 1
        ) {
          console.log("2nd condition frnachise and bmm");

          const franchise = partnerReferredByFranchise[0];
          console.log(franchise, "franchise");
          let franchiseReferralId = franchise.referralId;

          let ReferredIdOfFranchise = franchise.referredId;

          let franchiseWallet = franchise.franchiseWallet;
          const franchiseid = franchise.franchiseId;
          let target = franchise.target;
          const userType = franchise.userType;
          console.log(liquidity, "liquidity test");
          const afterGstLiquidity = (liquidity * 18) / 100;
          const afterGstAmount = liquidity - afterGstLiquidity;

          const referAmount = (afterGstAmount * 12) / 100;

          franchiseWallet += (afterGstAmount * 12) / 100;
          target += liquidity;
          const date = new Date();
          const updateFranchiseWalletQuery =
            "UPDATE create_franchise SET franchiseWallet = ?, target = ? WHERE franchiseId = ?";

          await connection
            .promise()
            .query(updateFranchiseWalletQuery, [
              franchiseWallet,
              target,
              franchiseid,
            ]);

          const insertFranchiseIntoMyTeam =
            "INSERT INTO my_team (userid, amount, partnerid, credit_date, userType) VALUES (?, ?, ?, ?, ?)";
          await connection
            .promise()
            .query(insertFranchiseIntoMyTeam, [
              franchiseid,
              referAmount,
              p_userid,
              date,
              userType,
            ]);

          const findBMMQuery = "SELECT * FROM create_sho WHERE referralId = ?";

          const [bmmResult] = await connection
            .promise()
            .query(findBMMQuery, [ReferredIdOfFranchise]);

          if (bmmResult.length > 0) {
            const bmm = bmmResult[0];
            const referralIdOfBmm = bmm.referralId;

            let bmmWallet = bmm.stateHandlerWallet;
            const bmmId = bmm.stateHandlerId;
            let netLiquidity = (liquidity * 82) / 100;
            const amount = (netLiquidity * 5) / 100;
            const date = new Date();
            const userType = bmm.userType;
            bmmWallet += amount;

            const updateBmmWalletQuery =
              "UPDATE create_sho SET stateHandlerWallet = ? WHERE referralId = ?";

            await connection
              .promise()
              .query(updateBmmWalletQuery, [bmmWallet, referralIdOfBmm]);

            const insertBmmIntoMyTeam =
              "INSERT INTO my_team (userid, amount, partnerid, credit_date, userType) VALUES (?, ?, ?, ?, ?)";
            await connection
              .promise()
              .query(insertBmmIntoMyTeam, [
                bmmId,
                amount,
                p_userid,
                date,
                userType,
              ]);
          }
        } else {
          //partner referred by bmm
          console.log("3rd condition only bmm");

          const findBmmQuery = "SELECT * FROM create_sho WHERE referralId = ?";

          const [result] = await connection
            .promise()
            .query(findBmmQuery, [referredIdOfPartner]);

          if (result.length > 0 && result[0].priority === 1) {
            const bmm = result[0];
            let bmmWallet = bmm.stateHandlerWallet;
            const bmmId = bmm.stateHandlerId;
            const afterGstLiquidity = (liquidity * 18) / 100;
            const afterGstAmount = liquidity - afterGstLiquidity;
            const amount = (afterGstAmount * 15) / 100;
            const date = new Date();
            bmmWallet += amount;
            let target = bmm.target;
            target = target + liquidity;
            const userType = bmm.userType;
            const referralIdOfBmm = bmm.referralId;

            const updateBmmWalletQuery =
              "UPDATE create_sho SET stateHandlerWallet = ?, target = ? WHERE stateHandlerId = ?";

            await connection
              .promise()
              .query(updateBmmWalletQuery, [bmmWallet, target, bmmId]);

            const insertBmmIntoMyTeam =
              "INSERT INTO my_team (userid, amount, partnerid, credit_date, userType) VALUES (?, ?, ?, ?, ?)";
            await connection
              .promise()
              .query(insertBmmIntoMyTeam, [
                bmmId,
                amount,
                p_userid,
                date,
                userType,
              ]);
          }

          // Additional code for processing and updating other tables goes here...

          return res.status(200).json({
            message: "Mining Partner Liquidity Paid successfully",
            // Include necessary information in the response
          });
        }
      } else {
        // Update multiple_rig_partner status
        const updateRigPaymentStatusQuery =
          "UPDATE multiple_rig_partner SET partner_status = 1, doj = CURRENT_DATE WHERE rigId = ?";
        await connection.promise().query(updateRigPaymentStatusQuery, [rigId]);
      }
    } else {
      if (rigId === rigid) {
        // Update multiple_rig_partner status
        const updateRigPaymentStatusQuery =
          "UPDATE mining_partner SET partner_status = 1 WHERE rigId = ?";
        await connection.promise().query(updateRigPaymentStatusQuery, [rigId]);
      } else {
        // Update multiple_rig_partner status
        const updateRigPaymentStatusQuery =
          "UPDATE multiple_rig_partner SET partner_status = 1 WHERE rigId = ?";
        await connection.promise().query(updateRigPaymentStatusQuery, [rigId]);
      }
    }

    return res.json({
      message: "Mining Partner Liquidity Paid successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.perdayAmountTransferToPartnerManual = (req, res) => {
  let reffered_id = "";
  let table_flag = "";
  let activePartnerCount = 0;
  let reffer_p_userid = "";
  //let member_count = 0 ;
  var main_check = true;

  const partnerid = req.body;

  var date = new Date(partnerid.partnerdate);
  var entrydate = date.toLocaleDateString();

  if (!partnerid.partnerdate || partnerid.perDayAmounReal === undefined) {
    return res.status(422).json({
      message: "Date or Amount not Selected!",
      status: 422,
    });
  }

  let datequery = "select * from partner_wallet_history where p_userid = ? ";
  connection.query(datequery, [partnerid.p_userid], (err, results) => {
    if (!err) {
      var i = results.length - 1;
      for (j = 0; j <= i; j++) {
        var exist_date = new Date(results[j].wallet_update_date);
        var exist_date1 = exist_date.toLocaleDateString();

        if (entrydate === exist_date1) {
          main_check = false;
          return res.status(409).json({
            message: "Already paid to this date",
            status: 409,
          });
        }
      }
    }
  });

  let query =
    "select partner_wallet,p_reffered_id,partner_status, p_liquidity,partner_count,login_counter from mining_partner where p_userid = ?";
  connection.query(query, [partnerid.p_userid], (err, results) => {
    if (!err) {
      let status = results[0].partner_status;

      if (status) {
        selectquery =
          " select partner_wallet,p_reffered_id,partner_status, p_liquidity,partner_count,month_count from mining_partner where p_userid = ?";
        connection.query(selectquery, [partnerid.p_userid], (err, results) => {
          try {
            if (!err) {
              let liquidity = results[0].p_liquidity;
              let partner_wallet = results[0].partner_wallet;
              let status = results[0].partner_status;
              let month_count = results[0].month_count;
              let partner_count = results[0].partner_count;
              //let walletAmount = (liquidity / 20000);

              partner_count = partner_count + 1;
              partner_wallet = partner_wallet + partnerid.perDayAmounReal;
              let request_date = new Date();

              if (status) {
                if (month_count === 12 || month_count > 12) {
                  let updatequery =
                    "update mining_partner set partner_status= ?,partner_wallet = ?, partner_count = ? where p_userid = ?";
                  connection.query(
                    updatequery,
                    [
                      (partner_status = 0),
                      (partner_wallet = 0),
                      (partner_count = 0),
                      partnerid.p_userid,
                    ],
                    (err, results) => {
                      try {
                        if (!err) {
                          // return res.status(400).json({
                          //   message: "Your Plan has been expired ",
                          // });
                          let selectPartnerData =
                            "select  * from mining_partner where p_userid=?";
                          connection.query(
                            selectPartnerData,
                            [partnerid.p_userid],
                            (err, results) => {
                              if (!err) {
                                let bonusAmount = (liquidity * 10) / 100;
                                let partner_wallet = results[0].partner_wallet;
                                let referredId = results[0].p_reffered_id;

                                partner_wallet = +bonusAmount;
                                let bonusQuery =
                                  "update mining_partner set partner_wallet = ? where p_userid = ? ";
                                connection.query(
                                  bonusQuery,
                                  [partner_wallet, partnerid.p_userid],
                                  (err, results) => {
                                    if (!err) {
                                      let findReferral =
                                        "select member_wallet from create_member where reffer_id = ?";
                                      connection.query(
                                        findReferral,
                                        [referredId],
                                        (err, results) => {
                                          if (!err) {
                                            let member_wallet =
                                              results[0].member_wallet;
                                            let memberBonus =
                                              (liquidity * 5) / 100;
                                            let updateWallet =
                                              member_wallet + memberBonus;
                                            let memberBonusQuery =
                                              "update create_member set member_wallet = ? where reffer_id = ?";
                                            connection.query(
                                              memberBonusQuery,
                                              [updateWallet, referredId],
                                              (err, results) => {
                                                if (!err) {
                                                }
                                              }
                                            );
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        } else {
                          return res.status(400).json({
                            message: "Something Went wrong 2",
                          });
                        }
                      } catch (error) {
                        return error;
                      }
                    }
                  );
                }

                let selectquery1 =
                  "select month_count, p_phone from mining_partner where p_userid = ?";
                connection.query(
                  selectquery1,
                  [partnerid.p_userid],
                  (err, results) => {
                    try {
                      if (!err) {
                        let month_count = results[0].month_count;
                        let p_phone = results[0].p_phone;

                        if (month_count < 12 && main_check) {
                          let perday_partner_wallet_amount =
                            partnerid.perDayAmounReal;
                          query =
                            "update mining_partner  set partner_wallet=?,wallet_update_date=?,partner_count=?,perday_partner_wallet_amount=? where p_userid =?";
                          connection.query(
                            query,
                            [
                              partner_wallet,
                              partnerid.partnerdate,
                              partner_count,
                              perday_partner_wallet_amount,
                              partnerid.p_userid,
                            ],
                            (err, results) => {
                              try {
                                if (!err) {
                                  if (partnerid.perDayAmounReal === 0) {
                                    partner_wallet = partner_wallet + 0;
                                    partnerid.perDayAmounReal = 0;
                                  }

                                  let insertquery =
                                    "insert into partner_wallet_history (walletAmount,wallet_update_date,p_userid) values (?,?,?)";
                                  connection.query(
                                    insertquery,
                                    [
                                      partnerid.perDayAmounReal,
                                      partnerid.partnerdate,
                                      partnerid.p_userid,
                                    ],
                                    (err, results) => {
                                      try {
                                        if (!err) {
                                          walletSms(p_phone, {
                                            type: "Partner",
                                            userid: partnerid.p_userid,
                                            amount: partnerid.perDayAmounReal,
                                          });
                                          let insertMonthlyPayout =
                                            "insert into partner_withdrawal (partner_wallet,request_date,p_userid) values (?,?,?)";
                                          connection.query(
                                            insertMonthlyPayout,
                                            [
                                              partnerid.perDayAmounReal,
                                              partnerid.partnerdate,
                                              partnerid.p_userid,
                                            ],
                                            (err, results) => {
                                              if (!err) {
                                                month_count = month_count + 1;
                                                let updatequery =
                                                  "update mining_partner set month_count=? where p_userid = ?";

                                                connection.query(
                                                  updatequery,
                                                  [
                                                    month_count,
                                                    partnerid.p_userid,
                                                  ],
                                                  (err, results) => {}
                                                );
                                              }
                                            }
                                          );

                                          let selectquery =
                                            "select p_reffered_id from mining_partner where p_userid= ?";
                                          connection.query(
                                            selectquery,
                                            [partnerid.p_userid],
                                            (err, results) => {
                                              if (!err) {
                                                if (
                                                  results[0]?.p_reffered_id !=
                                                  ""
                                                ) {
                                                  reffered_id =
                                                    results[0]?.p_reffered_id;

                                                  let selectquery =
                                                    "select id from mining_partner where p_refferal_id= ?";
                                                  connection.query(
                                                    selectquery,
                                                    [reffered_id],
                                                    (err, results) => {
                                                      if (!err) {
                                                        if (results[0]?.id) {
                                                          table_flag =
                                                            "mining_partner";
                                                          // if (
                                                          //   table_flag ===
                                                          //   "mining_partner"
                                                          // ) {
                                                          //   let refferquery =
                                                          //     "select p_reffered_id from mining_partner where p_userid = ?";
                                                          //   connection.query(
                                                          //     refferquery,
                                                          //     [
                                                          //       partnerid.p_userid,
                                                          //     ],
                                                          //     (
                                                          //       err,
                                                          //       results
                                                          //     ) => {
                                                          //       try {
                                                          //         console.log(
                                                          //           results[0]
                                                          //             .p_reffered_id
                                                          //         );
                                                          //         reffered_id =
                                                          //           results[0]
                                                          //             .p_reffered_id;
                                                          //         reffer_p_userid =
                                                          //           partnerid.p_userid;

                                                          //         if (!err) {
                                                          //           let query =
                                                          //             "select p_userid,partner_wallet,partner_count from mining_partner where p_refferal_id = ?";
                                                          //           connection.query(
                                                          //             query,
                                                          //             [
                                                          //               reffered_id,
                                                          //             ],
                                                          //             (
                                                          //               err,
                                                          //               results
                                                          //             ) => {
                                                          //               let partner_wallet =
                                                          //                 results[0]
                                                          //                   .partner_wallet;
                                                          //               let partner_count =
                                                          //                 results[0]
                                                          //                   .partner_count;
                                                          //               let p_userid =
                                                          //                 results[0]
                                                          //                   .p_userid;
                                                          //               let walletAmount =
                                                          //                 partnerid.refferal_Amount;

                                                          //               let insertquery =
                                                          //                 "insert into partner_reffer_wallet_history ( reffer_p_userid,wallet_amount,date,p_userid) values (?,?,?,?)";
                                                          //               connection.query(
                                                          //                 insertquery,
                                                          //                 [
                                                          //                   reffer_p_userid,
                                                          //                   walletAmount,
                                                          //                   partnerid.partnerdate,
                                                          //                   p_userid,
                                                          //                 ],
                                                          //                 (
                                                          //                   err,
                                                          //                   results
                                                          //                 ) => {
                                                          //                   try {
                                                          //                     if (
                                                          //                       !err
                                                          //                     ) {
                                                          //                       console.log(
                                                          //                         902
                                                          //                       );
                                                          //                       let insertRefferMonthlyPayout =
                                                          //                         "insert into partner_reffer_withdrawal (reffer_p_userid,partner_wallet,request_date,p_userid) values(?,?,?,?)";
                                                          //                       connection.query(
                                                          //                         insertRefferMonthlyPayout,
                                                          //                         [
                                                          //                           reffer_p_userid,
                                                          //                           walletAmount,
                                                          //                           partnerid.partnerdate,
                                                          //                           p_userid,
                                                          //                         ],
                                                          //                         (
                                                          //                           err,
                                                          //                           results
                                                          //                         ) => {
                                                          //                           if (
                                                          //                             !err
                                                          //                           ) {
                                                          //                           }
                                                          //                         }
                                                          //                       );
                                                          //                       let selectquery =
                                                          //                         "select * from partner_reffer_wallet where reffer_p_userid = ?";
                                                          //                       connection.query(
                                                          //                         selectquery,
                                                          //                         [
                                                          //                           reffer_p_userid,
                                                          //                         ],
                                                          //                         (
                                                          //                           err,
                                                          //                           results
                                                          //                         ) => {
                                                          //                           let partner_wallet =
                                                          //                             results[0]
                                                          //                               ?.partner_wallet;

                                                          //                           if (
                                                          //                             partnerid.perDayAmounReal ===
                                                          //                             0
                                                          //                           ) {
                                                          //                             partner_wallet =
                                                          //                               partner_wallet +
                                                          //                               0;
                                                          //                             walletAmount = 0;
                                                          //                           }
                                                          //                           if (
                                                          //                             partnerid.perDayAmounReal !=
                                                          //                             0
                                                          //                           ) {
                                                          //                             partner_wallet =
                                                          //                               partner_wallet +
                                                          //                               partnerid.refferal_Amount;
                                                          //                             walletAmount =
                                                          //                               partnerid.refferal_Amount;
                                                          //                           }

                                                          //                           if (
                                                          //                             results.length ===
                                                          //                             0
                                                          //                           ) {
                                                          //                             let insertquery =
                                                          //                               "insert into partner_reffer_wallet (reffer_p_userid,wallet_amount,date,p_userid,partner_wallet) values (?,?,?,?,?)";
                                                          //                             connection.query(
                                                          //                               insertquery,
                                                          //                               [
                                                          //                                 reffer_p_userid,
                                                          //                                 walletAmount,
                                                          //                                 partnerid.partnerdate,
                                                          //                                 p_userid,
                                                          //                                 walletAmount,
                                                          //                               ]
                                                          //                             );
                                                          //                           }
                                                          //                           if (
                                                          //                             results.length >
                                                          //                             0
                                                          //                           ) {
                                                          //                             let updatequery =
                                                          //                               "update partner_reffer_wallet set partner_wallet = ?, date = ? where reffer_p_userid = ?";
                                                          //                             connection.query(
                                                          //                               updatequery,
                                                          //                               [
                                                          //                                 partner_wallet,
                                                          //                                 partnerid.partnerdate,
                                                          //                                 reffer_p_userid,
                                                          //                               ],
                                                          //                               (
                                                          //                                 err,
                                                          //                                 results
                                                          //                               ) => {
                                                          //                                 if (
                                                          //                                   !err
                                                          //                                 ) {
                                                          //                                   console.log(
                                                          //                                     "898"
                                                          //                                   );
                                                          //                                 }
                                                          //                               }
                                                          //                             );
                                                          //                           }
                                                          //                         }
                                                          //                       );
                                                          //                     } else {
                                                          //                       return res
                                                          //                         .status(
                                                          //                           404
                                                          //                         )
                                                          //                         .json(
                                                          //                           {
                                                          //                             message:
                                                          //                               "Something Went Wrong",
                                                          //                           }
                                                          //                         );
                                                          //                     }
                                                          //                   } catch (error) {
                                                          //                     return error;
                                                          //                   }
                                                          //                 }
                                                          //               );

                                                          //             }
                                                          //           );
                                                          //         } else {
                                                          //           return res
                                                          //             .status(
                                                          //               404
                                                          //             )
                                                          //             .json({
                                                          //               message:
                                                          //                 "Something Went Wrong",
                                                          //             });
                                                          //         }
                                                          //       } catch (error) {
                                                          //         return error;
                                                          //       }
                                                          //     }
                                                          //   );
                                                          // }
                                                          // mining reffer close
                                                        }
                                                      }
                                                    }
                                                  );

                                                  if (table_flag === "") {
                                                    let selectquery =
                                                      "select id from create_member where reffer_id= ?";
                                                    connection.query(
                                                      selectquery,
                                                      [reffered_id],
                                                      (err, results) => {
                                                        if (!err) {
                                                          if (results[0]?.id) {
                                                            table_flag =
                                                              "create_member";

                                                            // if (
                                                            //   table_flag ===
                                                            //   "create_member"
                                                            // ) {
                                                            //   let selectquery =
                                                            //     "select m_userid,member_wallet,member_count,added_wallet,m_phone from create_member where reffer_id = ?";
                                                            //   connection.query(
                                                            //     selectquery,
                                                            //     [reffered_id],
                                                            //     (
                                                            //       err,
                                                            //       results
                                                            //     ) => {
                                                            //       if (!err) {
                                                            //         let added_wallet =
                                                            //           results[0]
                                                            //             .added_wallet;
                                                            //         let member_wallet =
                                                            //           results[0]
                                                            //             .member_wallet;
                                                            //         let member_count =
                                                            //           results[0]
                                                            //             ?.member_count;
                                                            //         let m_userid =
                                                            //           results[0]
                                                            //             .m_userid;
                                                            //         let memberPhone =
                                                            //           results[0]
                                                            //             .m_phone;
                                                            //         let walletAmount =
                                                            //           partnerid.refferal_Amount;

                                                            //         let memberdate_query =
                                                            //           "select * from member_wallet_history where m_userid = ? ";
                                                            //         connection.query(
                                                            //           memberdate_query,
                                                            //           [
                                                            //             m_userid,
                                                            //           ],
                                                            //           (
                                                            //             err,
                                                            //             results
                                                            //           ) => {

                                                            //             if (
                                                            //               !err
                                                            //             ) {
                                                            //               var i =
                                                            //                 results.length -
                                                            //                 1;
                                                            //               let check = false;
                                                            //               for (
                                                            //                 j = 0;
                                                            //                 j <=
                                                            //                 i;
                                                            //                 j++
                                                            //               ) {
                                                            //                 var exist_date =
                                                            //                   new Date(
                                                            //                     results[
                                                            //                       j
                                                            //                     ].wallet_update_date
                                                            //                   );
                                                            //                 var exist_date1 =
                                                            //                   exist_date.toLocaleDateString();

                                                            //                 if (
                                                            //                   entrydate ===
                                                            //                   exist_date1
                                                            //                 ) {
                                                            //                   check = true;
                                                            //                 }
                                                            //               }
                                                            //               if (
                                                            //                 check
                                                            //               ) {
                                                            //                 member_count =
                                                            //                   member_count +
                                                            //                   0;
                                                            //               } else {
                                                            //                 member_count =
                                                            //                   member_count +
                                                            //                   1;
                                                            //               }
                                                            //             }
                                                            //           }
                                                            //         );

                                                            //         console.log(
                                                            //           member_wallet,
                                                            //           "557"
                                                            //         );

                                                            //         if (
                                                            //           partnerid.perDayAmounReal ===
                                                            //           0
                                                            //         ) {
                                                            //           member_wallet =
                                                            //             member_wallet +
                                                            //             0;
                                                            //           walletAmount = 0;
                                                            //         }

                                                            //         if (
                                                            //           partnerid.perDayAmounReal !==
                                                            //           0
                                                            //         ) {
                                                            //           member_wallet =
                                                            //             member_wallet +
                                                            //             partnerid.refferal_Amount;
                                                            //           walletAmount =
                                                            //             partnerid.refferal_Amount;
                                                            //         }

                                                            //         let wallet_update_date =
                                                            //           new Date();

                                                            //         if (
                                                            //           member_count ===
                                                            //           30
                                                            //         ) {
                                                            //           let insertquery =
                                                            //             "insert into member_withdrawal(member_wallet,request_date,m_userid) values(?,?,?)";
                                                            //           connection.query(
                                                            //             insertquery,
                                                            //             [
                                                            //               member_wallet,
                                                            //               request_date,
                                                            //               m_userid,
                                                            //             ],
                                                            //             (
                                                            //               err,
                                                            //               results
                                                            //             ) => {
                                                            //               if (
                                                            //                 !err
                                                            //               ) {
                                                            //                 let perday_member_wallet_amount =
                                                            //                   walletAmount;
                                                            //                 let updatequery =
                                                            //                   "update create_member set member_count =?, member_wallet =?,perday_member_wallet_amount=?,added_wallet = ? where m_userid =?";
                                                            //                 connection.query(
                                                            //                   updatequery,
                                                            //                   [
                                                            //                     (member_count = 0),
                                                            //                     (member_wallet = 0),
                                                            //                     (perday_member_wallet_amount = 0),
                                                            //                     (added_wallet = 0),
                                                            //                     m_userid,
                                                            //                   ],
                                                            //                   (
                                                            //                     err,
                                                            //                     results
                                                            //                   ) => {
                                                            //                     if (
                                                            //                       !err
                                                            //                     ) {
                                                            //                       // Success
                                                            //                     } else {
                                                            //                       return res
                                                            //                         .status(
                                                            //                           400
                                                            //                         )
                                                            //                         .json(
                                                            //                           {
                                                            //                             message:
                                                            //                               "Something Went Wrong 3",
                                                            //                           }
                                                            //                         );
                                                            //                     }
                                                            //                   }
                                                            //                 );
                                                            //               } else {
                                                            //                 return res
                                                            //                   .status(
                                                            //                     400
                                                            //                   )
                                                            //                   .json(
                                                            //                     {
                                                            //                       message:
                                                            //                         "Something Went Wrong 4",
                                                            //                     }
                                                            //                   );
                                                            //               }
                                                            //             }
                                                            //           );
                                                            //         }

                                                            //         //------------------------------------
                                                            //         let insertMemberRefferMonthlyPayout =
                                                            //           "insert into  member_reffer_withdrawal (reffer_p_userid,member_wallet,request_date,m_userid) values (?,?,?,?)";
                                                            //         connection.query(
                                                            //           insertMemberRefferMonthlyPayout,
                                                            //           [
                                                            //             partnerid.p_userid,
                                                            //             walletAmount,
                                                            //             partnerid.partnerdate,
                                                            //             m_userid,
                                                            //           ],
                                                            //           (
                                                            //             err,
                                                            //             results
                                                            //           ) => {}
                                                            //         );
                                                            //         let selectMemberRefferWalletHistory =
                                                            //           "select * from member_reffer_wallet_history where reffer_p_userid =?";
                                                            //         connection.query(
                                                            //           selectMemberRefferWalletHistory,
                                                            //           [
                                                            //             partnerid.p_userid,
                                                            //           ],
                                                            //           (
                                                            //             err,
                                                            //             results
                                                            //           ) => {
                                                            //             let member_wallet =
                                                            //               results[0]
                                                            //                 ?.member_wallet;

                                                            //             member_wallet =
                                                            //               member_wallet +
                                                            //               walletAmount;

                                                            //             if (
                                                            //               results.length <
                                                            //               1
                                                            //             ) {
                                                            //               let insertMemberRefferWalletHistory =
                                                            //                 " insert into member_reffer_wallet_history (m_userid,member_wallet,wallet_update_date,reffer_p_userid) values (?,?,?,?)";
                                                            //               connection.query(
                                                            //                 insertMemberRefferWalletHistory,
                                                            //                 [
                                                            //                   m_userid,
                                                            //                   walletAmount,
                                                            //                   partnerid.partnerdate,
                                                            //                   partnerid.p_userid,
                                                            //                 ],
                                                            //                 (
                                                            //                   err,
                                                            //                   results
                                                            //                 ) => {}
                                                            //               );
                                                            //             }
                                                            //             if (
                                                            //               results.length >
                                                            //               0
                                                            //             ) {
                                                            //               console.log(
                                                            //                 "1126"
                                                            //               );
                                                            //               let updateMemberRefferWalletHistory =
                                                            //                 "update member_reffer_wallet_history set member_wallet =?, wallet_update_date =? where reffer_p_userid =?";
                                                            //               connection.query(
                                                            //                 updateMemberRefferWalletHistory,
                                                            //                 [
                                                            //                   member_wallet,
                                                            //                   partnerid.partnerdate,
                                                            //                   partnerid.p_userid,
                                                            //                 ],
                                                            //                 (
                                                            //                   err,
                                                            //                   results
                                                            //                 ) => {
                                                            //                   console.log(
                                                            //                     results,
                                                            //                     "1129"
                                                            //                   );
                                                            //                 }
                                                            //               );
                                                            //             }

                                                            //             let selectquery =
                                                            //               "select partner_count from mining_partner where p_userid = ?";
                                                            //             connection.query(
                                                            //               selectquery,
                                                            //               [
                                                            //                 partnerid.p_userid,
                                                            //               ],
                                                            //               (
                                                            //                 err,
                                                            //                 results
                                                            //               ) => {
                                                            //                 let partner_count =
                                                            //                   results[0]
                                                            //                     ?.partner_count;
                                                            //                 console.log(
                                                            //                   results[0]
                                                            //                     ?.partner_count,
                                                            //                   "1137"
                                                            //                 );

                                                            //                 if (
                                                            //                   partner_count ===
                                                            //                   30
                                                            //                 ) {
                                                            //                   let selectMemberRefferWalletHistory =
                                                            //                     "select * from member_reffer_wallet_history where reffer_p_userid =?";
                                                            //                   connection.query(
                                                            //                     selectMemberRefferWalletHistory,
                                                            //                     [
                                                            //                       partnerid.p_userid,
                                                            //                     ],
                                                            //                     (
                                                            //                       err,
                                                            //                       results
                                                            //                     ) => {
                                                            //                       let m_userid =
                                                            //                         results[0]
                                                            //                           ?.m_userid;
                                                            //                       let member_wallet =
                                                            //                         results[0]
                                                            //                           ?.member_wallet;
                                                            //                       let reffer_p_userid =
                                                            //                         results[0]
                                                            //                           ?.reffer_p_userid;

                                                            //                       let insertMemberRefferWithdrawal =
                                                            //                         "insert into member_reffer_withdrawal (m_userid,member_wallet,request_date,reffer_p_userid) values (?,?,?,?)";
                                                            //                       connection.query(
                                                            //                         insertMemberRefferWithdrawal,
                                                            //                         [
                                                            //                           m_userid,
                                                            //                           member_wallet,
                                                            //                           partnerid.partnerdate,
                                                            //                           reffer_p_userid,
                                                            //                         ],
                                                            //                         (
                                                            //                           err,
                                                            //                           results
                                                            //                         ) => {
                                                            //                           if (
                                                            //                             !err
                                                            //                           ) {
                                                            //                             let updateMemberRefferWalletHistory =
                                                            //                               "update member_reffer_wallet_history set member_wallet =?, wallet_update_date =? where reffer_p_userid =?";
                                                            //                             connection.query(
                                                            //                               updateMemberRefferWalletHistory,
                                                            //                               [
                                                            //                                 (member_wallet = 0),
                                                            //                                 partnerid.partnerdate,
                                                            //                                 partnerid.p_userid,
                                                            //                               ],
                                                            //                               (
                                                            //                                 err,
                                                            //                                 results
                                                            //                               ) => {}
                                                            //                             );
                                                            //                           }
                                                            //                         }
                                                            //                       );
                                                            //                     }
                                                            //                   );
                                                            //                 }
                                                            //               }
                                                            //             );
                                                            //           }
                                                            //         );

                                                            //         let insertquery =
                                                            //           "insert into member_wallet_history(walletAmount,wallet_update_date,m_userid,reffer_user) values (?,?,?,?)";
                                                            //         connection.query(
                                                            //           insertquery,
                                                            //           [
                                                            //             walletAmount,
                                                            //             partnerid.partnerdate,
                                                            //             m_userid,
                                                            //             partnerid.p_userid,
                                                            //           ],
                                                            //           (
                                                            //             err,
                                                            //             results
                                                            //           ) => {
                                                            //             if (
                                                            //               !err
                                                            //             ) {
                                                            //               if (
                                                            //                 partnerid.perDayAmounReal ===
                                                            //                 0
                                                            //               ) {
                                                            //                 memberWalletSms(
                                                            //                   memberPhone,
                                                            //                   {
                                                            //                     type: "Member",
                                                            //                     userid:
                                                            //                       m_userid,
                                                            //                     amount:
                                                            //                       partnerid.perDayAmounReal,
                                                            //                   }
                                                            //                 );
                                                            //               }
                                                            //               if (
                                                            //                 partnerid.perDayAmounReal !=
                                                            //                 0
                                                            //               ) {
                                                            //                 memberWalletSms(
                                                            //                   memberPhone,
                                                            //                   {
                                                            //                     type: "Member",
                                                            //                     userid:
                                                            //                       m_userid,
                                                            //                     amount:
                                                            //                       walletAmount,
                                                            //                   }
                                                            //                 );
                                                            //               }

                                                            //               let perday_member_wallet_amount =
                                                            //                 walletAmount;

                                                            //               let updatequery =
                                                            //                 "update create_member set member_wallet=?,wallet_update_date=?,member_count=?,perday_member_wallet_amount=?,added_wallet = ? where m_userid =?";
                                                            //               connection.query(
                                                            //                 updatequery,
                                                            //                 [
                                                            //                   member_wallet,
                                                            //                   partnerid.partnerdate,
                                                            //                   member_count,
                                                            //                   perday_member_wallet_amount,
                                                            //                   added_wallet,
                                                            //                   m_userid,
                                                            //                 ],
                                                            //                 (
                                                            //                   err,
                                                            //                   results
                                                            //                 ) => {
                                                            //                   if (
                                                            //                     !err
                                                            //                   ) {
                                                            //                     // if (activePartnerCount === 0) {
                                                            //                     //     let setTotalWalletZero = "update create_member set member_count =?, member_wallet =?,perday_member_wallet_amount=? where m_userid =?";
                                                            //                     //     connection.query(setTotalWalletZero, [member_count = 0, member_wallet = 0, perday_member_wallet_amount = 0, m_userid], (err, results) => {
                                                            //                     //         if (!err) {
                                                            //                     //         }
                                                            //                     //     })
                                                            //                     // }
                                                            //                   }
                                                            //                 }
                                                            //               );
                                                            //             }
                                                            //           }
                                                            //         );
                                                            //       } else {
                                                            //         return res
                                                            //           .status(
                                                            //             400
                                                            //           )
                                                            //           .json({
                                                            //             messgae:
                                                            //               "Something Went Wrong 5",
                                                            //           });
                                                            //       }
                                                            //     }
                                                            //   );
                                                            // }
                                                          }
                                                        }
                                                      }
                                                    );
                                                  }
                                                }
                                              }
                                            }
                                          );
                                          return res.status(200).json({
                                            message:
                                              "Partner Wallet Added successfully",
                                          });
                                        } else {
                                        }
                                      } catch (error) {}
                                    }
                                  );
                                } else {
                                  return res.status(500).json({
                                    message: "Internal Server Error",
                                  });
                                }
                              } catch (error) {
                                return error;
                              }
                            }
                          );
                        }
                      }
                    } catch (error) {
                      return res.status(400).json({
                        message: "Something Went Wrong 6",
                      });
                    }
                  }
                );

                // 30days block start
                let selectquery =
                  "select partner_count,partner_wallet,perday_partner_wallet_amount from mining_partner where p_userid = ?";
                connection.query(
                  selectquery,
                  [partnerid.p_userid],
                  (err, results) => {
                    let partner_count = results[0]?.partner_count;
                    let partner_wallet = results[0]?.partner_wallet;
                    //let perday_partner_wallet_amount = results[0]?.perday_partner_wallet_amount;

                    if (partner_count === 30) {
                      let insertquery =
                        "insert into partner_withdrawal (partner_wallet,request_date,p_userid) values (?,?,?)";
                      connection.query(
                        insertquery,
                        [partner_wallet, request_date, partnerid.p_userid],
                        (err, results) => {
                          if (!err) {
                            month_count = month_count + 1;
                            let updatequery =
                              "update mining_partner set partner_wallet =?, partner_count=?,month_count=? where p_userid = ?";

                            connection.query(
                              updatequery,
                              [
                                (partner_wallet = partnerid.perDayAmounReal),
                                (partner_count = 1),
                                month_count,
                                partnerid.p_userid,
                              ],
                              (err, results) => {
                                try {
                                  if (!err) {
                                    // return res.status(200).json({
                                    //     message: "Mining Partner Set Zero "
                                    // })
                                    let selectquery =
                                      "select * from partner_reffer_wallet where reffer_p_userid = ?";
                                    connection.query(
                                      selectquery,
                                      [partnerid.p_userid],
                                      (err, results) => {
                                        if (!err) {
                                          let p_userid = results[0]?.p_userid;
                                          let partner_wallet =
                                            results[0]?.partner_wallet;

                                          let wallet_amount =
                                            results[0]?.wallet_amount;
                                          let reffer_p_userid =
                                            results[0]?.reffer_p_userid;

                                          let insertquery =
                                            "insert into partner_reffer_withdrawal (partner_wallet,request_date,reffer_p_userid,p_userid) values(?,?,?,?)";
                                          connection.query(
                                            insertquery,
                                            [
                                              partner_wallet,
                                              request_date,
                                              reffer_p_userid,
                                              p_userid,
                                            ],
                                            (err, results) => {
                                              if (!err) {
                                                let updatequery =
                                                  "update partner_reffer_wallet set partner_wallet=? where reffer_p_userid = ?";
                                                connection.query(
                                                  updatequery,
                                                  [
                                                    (partner_wallet = 0),
                                                    partnerid.p_userid,
                                                  ],
                                                  (err, results) => {
                                                    if (!err) {
                                                      if (
                                                        month_count === 12 ||
                                                        month_count > 12
                                                      ) {
                                                        let updatequery =
                                                          "update mining_partner set partner_status= ?,partner_wallet = ?,partner_count = ? where p_userid = ?";
                                                        connection.query(
                                                          updatequery,
                                                          [
                                                            (partner_status = 0),
                                                            (partner_wallet = 0),
                                                            (partner_count = 0),
                                                            partnerid.p_userid,
                                                          ],
                                                          (err, results) => {
                                                            try {
                                                              if (!err) {
                                                                return res
                                                                  .status(400)
                                                                  .json({
                                                                    message:
                                                                      "Your Plan has been expired ",
                                                                  });
                                                              } else {
                                                                return res
                                                                  .status(400)
                                                                  .json({
                                                                    message:
                                                                      "Something Went wrong 2",
                                                                  });
                                                              }
                                                            } catch (error) {
                                                              return error;
                                                            }
                                                          }
                                                        );
                                                      }
                                                    }
                                                  }
                                                );
                                                //console.log(reffer_p_userid,partnerid.p_userid,'1244');
                                              }
                                            }
                                          );
                                        }
                                      }
                                    );
                                  } else {
                                    return res.status(404).json({
                                      message: "Something Went Wrong 1",
                                    });
                                  }
                                } catch (error) {
                                  return error;
                                }
                              }
                            );
                          } else {
                            return res.status(500).json({
                              message: "Internal Server Error",
                            });
                          }
                        }
                      );
                    }
                  }
                );

                // 30days block end
              }
            } else {
              return res.status(400).json({
                message: "Something went Wrong 7",
              });
            }
          } catch (error) {
            return res.status(500).json(err);
          }
        });
      } else {
        return res.status(400).json({
          message: "Account is Not Active",
        });
      }
    }
  });
};

// particularPerdayPartnerWithdrawalRequestFromAdmin
exports.particularPerdayPartnerWithdrawalRequestFromAdmin = (req, res) => {
  let partnerid = req.body;
  let query =
    "select partner_wallet,request_date,id from partner_withdrawal where p_userid =? ";
  connection.query(query, [partnerid.p_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Partner Withdrawal Request  data successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// particularPartnerApprovedWithdrawalHistoryFromAdmin
exports.particularPartnerApprovedWithdrawalHistoryFromAdmin = (req, res) => {
  let partnerid = req.body;
  let query = "select * from partner_withdrawal_history where p_userid =? ";
  connection.query(query, [partnerid.p_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Partner Withdrawal History data successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchLastPaymentDate
exports.fetchLastPaymentDate = (req, res) => {
  let partnerid = req.body;
  let query =
    "select approve_date from partner_withdrawal_history where p_userid =? ";
  connection.query(query, [partnerid.p_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Last Payment Date  successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// approveRefferPartnerWithdrawalRequest
exports.approveRefferPartnerWithdrawalRequest = (req, res) => {
  let partnerId = req.body;
  let query =
    "select partner_wallet,request_date,id,reffer_p_userid,p_userid from partner_reffer_withdrawal where id = ? ";
  connection.query(query, [partnerId.id], (err, results) => {
    if (!err) {
      let partner_wallet = results[0]?.partner_wallet;
      let id = results[0]?.id;
      let request_date = results[0]?.request_date;
      let reffer_p_userid = results[0]?.reffer_p_userid;
      let p_userid = results[0]?.p_userid;
      let approve_date = new Date();
      let insertquery =
        "insert into partner_reffer_withdrawal_history (partner_wallet,request_date,approve_date,reffer_p_userid,p_userid) values (?,?,?,?,?)";
      connection.query(
        insertquery,
        [
          partner_wallet,
          request_date,
          approve_date,
          reffer_p_userid,
          partnerId.p_userid,
        ],
        (err, results) => {
          try {
            if (!err) {
              let selectquery =
                "select p_email,p_phone from mining_partner where p_userid = ?";
              connection.query(
                selectquery,
                [partnerId.p_userid],
                (err, results) => {
                  try {
                    if (!err) {
                      partnerEmail = results[0]?.p_email;
                      partnerPhone = results[0]?.p_phone;
                      withdrawalSms(partnerPhone, {
                        type: "Partner",
                        userid: partnerId.p_userid,
                        amount: partner_wallet,
                      });

                      email(partnerEmail, { withdrawalAmount: partner_wallet });
                    } else {
                      return res.status(500).json({
                        message: "Something Went Wrong",
                      });
                    }
                  } catch (error) {
                    return res.status(500).json(error);
                  }
                }
              );

              let deletequery =
                "delete from partner_reffer_withdrawal where id = ?";
              connection.query(deletequery, [partnerId.id], (err, results) => {
                if (!err) {
                  return res.status(200).json({
                    message: " Partner Reffer Withdrwal Request Approved",
                  });
                }
              });
            } else {
              return res.status(500).json({
                message: "Something Went Wrong",
              });
            }
          } catch (error) {
            return res.status(500).json(error);
          }
        }
      );
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchPartnerRefferalWithdrawalRequest
exports.fetchPartnerRefferalWithdrawalRequest = (req, res) => {
  let query =
    "select p_userid,partner_wallet,request_date,id,reffer_p_userid from partner_reffer_withdrawal ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Partner Refferal Withdrawal Request successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchPartnerRefferalApproveWithdrawal
exports.fetchPartnerRefferalApproveWithdrawal = (req, res) => {
  let query =
    "select p_userid,partner_wallet,request_date,id,reffer_p_userid,approve_date from partner_reffer_withdrawal_history ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Partner Refferal Approved Withdrawal successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchMemberRefferWithdrawalRequestFromAdmin
exports.fetchMemberRefferWithdrawalRequestFromAdmin = (req, res) => {
  const { memberId } = req.body;
  let query = "select * from payment_request where userId = ? ";
  connection.query(query, [memberId], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Member Refferal Withdrawal Request successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// approveMemberRefferWithdrawalRequest
exports.approveMemberRefferWithdrawalRequest = (req, res) => {
  const member = req.body;
  const query = "SELECT * FROM payment_request WHERE id = ?";

  connection.query(query, [member.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Withdrawal request not found" });
    }

    const { amount, id, requestDate, userId, paymentBy } = results[0];
    const approveDate = new Date();
    const insertQuery =
      "INSERT INTO payment_approve (userId,amount, requestDate, approveDate,bankName) VALUES (?, ?, ?, ?,?)";

    connection.query(
      insertQuery,
      [userId, amount, requestDate, approveDate, paymentBy],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error" });
        }

        const selectQuery =
          "SELECT m_email, m_phone FROM create_member WHERE m_userid = ?";

        connection.query(selectQuery, [userId], (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
          }

          if (results.length === 0) {
            return res.status(404).json({ message: "Member not found" });
          }

          const memberEmail = results[0]?.m_email;
          const memberPhone = results[0]?.m_phone;

          // withdrawalSms(memberPhone, {
          //   type: "Member",
          //   userid: m_userid,
          //   amount: member_wallet,
          // });

          email(memberEmail, { withdrawalAmount: amount });

          const deleteQuery = "DELETE FROM payment_request WHERE id = ?";
          connection.query(deleteQuery, [id], (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Database error" });
            } else {
              return res.status(200).json({
                message: "Withdrawal Request approved",
              });
            }
          });
        });
      }
    );
  });
};

// fetchMemberRefferApproveWithdrawalHostoryFromAdmin
exports.fetchMemberRefferApproveWithdrawalHostoryFromAdmin = (req, res) => {
  let query =
    "select m_userid,member_wallet,request_date,id,reffer_p_userid,approve_date from member_reffer_withdrawal_history ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Member Refferal Approved Withdrawal successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// uploadPartnershipBond
exports.uploadPartnershipBond = (req, res) => {
  if (!req.file) {
    return res.status(422).send("No file submitted");
  }
  const { originalname, mimetype, filename } = req.file;
  const { p_userid } = req.body;
  if (!p_userid) {
    return res.status(422).send("User ID not found !");
  }

  let selectFileQuery =
    "select p_userid,partner_status from mining_partner where p_userid = ?";
  connection.query(selectFileQuery, [p_userid], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        let partner_status = results[0]?.partner_status;
        if (partner_status === 0) {
          return res.status(422).send("Partner status is not active !");
        } else {
          let date = new Date();
          let insertQueryToSaveFile =
            "insert into partnership_bond (p_userid,upload_date,originalname, mimetype, filename) values(?,?,?,?,?)";
          const values = [p_userid, date, originalname, mimetype, filename];
          connection.query(insertQueryToSaveFile, values, (err, results) => {
            if (!err) {
              return res.status(201).json({
                message: "File uploaded!",
              });
            } else {
              return res.status(400).json({
                message: "Not Save",
              });
            }
          });
        }
      } else {
        return res.status(400).json({
          message: "No User Found!",
        });
      }
    }
  });
};

// fetchHelpAndSupportQuery
exports.fetchHelpAndSupportQuery = (req, res) => {
  let query = "select id,p_userid,query_date,query from help_and_support";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched All Help related query",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchParticularHelpAndSupportQuery
exports.fetchParticularHelpAndSupportQuery = (req, res) => {
  let partnerId = req.body;
  let query = "select query from help_and_support where id = ?";
  connection.query(query, [partnerId.id], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Particular  Help related query",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// accountsPaidWithdrawal
exports.accountsPaidWithdrawal = (req, res) => {
  let query =
    "select sum(partner_wallet) as sumOfPartnerWallet from  partner_withdrawal_history";
  connection.query(query, (err, results) => {
    if (!err) {
      let sumOfPartnerWallet = results[0].sumOfPartnerWallet;
      let query =
        "select sum(partner_wallet) as sumOfRefferPartnerWallet from partner_reffer_withdrawal_history";
      connection.query(query, (err, results) => {
        if (!err) {
          let sumOfRefferPartnerWallet = results[0].sumOfRefferPartnerWallet;
          let query =
            "select sum(member_wallet) as sumOfRefferalMemberWallet from member_reffer_withdrawal_history";
          connection.query(query, (err, results) => {
            if (!err) {
              let sumOfRefferalMemberWallet =
                results[0]?.sumOfRefferalMemberWallet !== undefined
                  ? results[0]?.sumOfRefferalMemberWallet
                  : 0;

              let TotalPaidWithdrawal =
                sumOfPartnerWallet +
                sumOfRefferPartnerWallet +
                sumOfRefferalMemberWallet;
              return res.status(200).json({
                message: "Fetched Sum Of All Member Wallet successfully",
                partner: sumOfPartnerWallet,
                reffrePartner: sumOfRefferPartnerWallet,
                refferalMember: sumOfRefferalMemberWallet,
                totalWithdrawal: TotalPaidWithdrawal,
              });
            }
          });
        }
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

exports.fetchAllFranchise = (req, res) => {
  const selectAllFranchiseQuery = "SELECT * FROM create_franchise";

  connection.query(selectAllFranchiseQuery, (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({
      message: "Franchise records fetched successfully",
      franchiseData: results,
    });
  });
};

//back details fetched

exports.fetchBankDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const bankDetailsQuery = "SELECT * FROM bank_details WHERE user_id = ?";

    connection.query(bankDetailsQuery, [userId], (error, result) => {
      if (error) {
        console.error("Error fetching bank details:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "Bank details not found for the given userId" });
      }

      return res.status(200).json({ message: "Bank details fetched", result });
    });
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//======================================================================

exports.blockAndUnblockFranchise = async (req, res) => {
  try {
    const { isBlocked, franchiseId } = req.body;

    const updateFranchiseQuery =
      "UPDATE create_franchise SET isBlocked = ? WHERE franchiseId = ?";

    connection.query(
      updateFranchiseQuery,
      [isBlocked, franchiseId],
      (error, result) => {
        if (error) {
          console.error("Error executing SQL query:", error.message);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Franchise not found" });
        }

        const message = isBlocked
          ? "Franchise is blocked successfully."
          : "Franchise is unblocked successfully.";

        res.status(200).json({ message });
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//fetch all sho

exports.fetchAllSho = async (req, res) => {
  try {
    const selectAllShoQuery = "SELECT * FROM create_sho";

    connection.query(selectAllShoQuery, (error, results) => {
      if (error) {
        console.error("Error fetching sho details:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      // Successfully fetched sho records
      return res.status(200).json({
        message: "Sho records fetched successfully",
        shoData: results,
      });
    });
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//block and unblock sho

exports.blockAndUnblockSho = async (req, res) => {
  try {
    const { isBlocked, stateHandlerId } = req.body;

    const updateShoQuery =
      "UPDATE create_sho SET isBlocked = ? WHERE stateHandlerId = ?";

    connection.query(
      updateShoQuery,
      [isBlocked, stateHandlerId],
      (error, result) => {
        if (error) {
          console.error("Error executing SQL query:", error.message);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Sho not found" });
        }

        const message = isBlocked
          ? "S.H.O is blocked successfully."
          : "S.H.O is unblocked successfully.";

        res.status(200).json({ message });
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//adminVerifyMember
exports.adminVerifyMember = async (req, res) => {
  try {
    const { m_userid, isVerify, verifyDate } = req.body;

    const upadteMemberQuery =
      "UPDATE create_member SET isVerify =?,verifyDate = ? WHERE m_userid = ?";

    connection.query(
      upadteMemberQuery,
      [isVerify, verifyDate, m_userid],
      (error, result) => {
        if (error) {
          console.error("Error updating Member:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows == 0) {
          return res.status(200).json({ message: "Member not found" });
        }

        return res
          .status(200)
          .json({ message: "Member successfully verified" });
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// adminBlockMember
exports.adminBlockMember = async (req, res) => {
  try {
    const { isBlocked, m_userid } = req.body;

    const updateMemberQuery =
      "UPDATE create_member SET isBlocked = ? WHERE m_userid = ?";

    connection.query(
      updateMemberQuery,
      [isBlocked, m_userid],
      (error, result) => {
        if (error) {
          console.error("Error executing SQL query:", error.message);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Member not found" });
        }

        const message = isBlocked
          ? "Member is blocked successfully."
          : "Member is unblocked successfully.";

        res.status(200).json({ message });
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// adminFetchAllMiningPartner
exports.adminFetchAllMiningPartner = async (req, res) => {
  const query = "SELECT * FROM mining_partner";

  try {
    const [results] = await connection.promise().query(query);
    console.log(results);

    // Separate data based on the date part of p_dop column
    const beforeDec152023 = results.filter(
      (entry) =>
        new Date(entry.p_dop).setHours(0, 0, 0, 0) < new Date("2023-12-15")
    );
    const afterDec152023 = results.filter(
      (entry) =>
        new Date(entry.p_dop).setHours(0, 0, 0, 0) >= new Date("2023-12-15")
    );

    return res.status(200).json({
      message: "Fetched data successfully",
      beforeDec152023,
      afterDec152023,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

// adminVerifyPartner
exports.adminVerifyPartner = async (req, res) => {
  try {
    const { p_userid, isVerify, verifyDate } = req.body;

    if (typeof isVerify != "boolean") {
      return res.status(400).json({ message: "Invalid 'isVerify' value" });
    }

    const upadtePartnerQuery =
      "UPDATE mining_partner SET isVerify =?, verifyDate = ? WHERE p_userid = ?";

    connection.query(
      upadtePartnerQuery,
      [isVerify, verifyDate, p_userid],
      (error, result) => {
        if (error) {
          console.error("Error updating Member:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows == 0) {
          return res.status(200).json({ message: "Partner not found" });
        }

        return res.status(200).json({ message: "Partner verified" });
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// adminBlockUnblockPartner
exports.adminBlockUnblockPartner = async (req, res) => {
  try {
    const { isBlocked, p_userid } = req.body;

    const updatePartnerQuery =
      "UPDATE mining_partner SET isBlocked = ? WHERE p_userid = ?";

    connection.query(
      updatePartnerQuery,
      [isBlocked, p_userid],
      (error, result) => {
        if (error) {
          console.error("Error executing SQL query:", error.message);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Partner not found" });
        }

        const message = isBlocked
          ? "Partner is blocked successfully."
          : "Partner is unblocked successfully.";

        res.status(200).json({ message });
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.approvePaymentRequestOfSho = async (req, res) => {
  try {
    const { id } = req.body;

    // Check if the payment request exists
    const checkPaymentRequestQuery =
      "SELECT * FROM payment_request WHERE id = ?";
    connection.query(checkPaymentRequestQuery, [id], async (error, results) => {
      if (error) {
        console.error("Error checking payment request:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Payment request not found." });
      }

      const paymentRequest = results[0];

      // Fetch the user's bank name
      const fetchUserBankQuery =
        "SELECT bank_name FROM bank_details WHERE user_id = ? AND isPrimary =1";
      connection.query(
        fetchUserBankQuery,
        [paymentRequest.userId],
        async (error, bankResults) => {
          if (error) {
            console.error("Error fetching user's bank name:", error);
            return res.status(500).json({ message: "Internal Server Error" });
          }

          if (bankResults.length === 0) {
            return res
              .status(400)
              .json({ message: "User's bank details not found" });
          }

          const userBankName = bankResults[0].bank_name;

          const insertPaymentApprovalQuery = `
          INSERT INTO payment_approve (userId, amount, requestDate, approveDate, bankName)
          VALUES (?, ?, ?, NOW(), ?)
        `;

          connection.query(
            insertPaymentApprovalQuery,
            [
              paymentRequest.userId,
              paymentRequest.amount,
              paymentRequest.requestDate,
              userBankName, // Include the user's bank name in the query
            ],
            async (error) => {
              if (error) {
                console.error("Error inserting payment approval:", error);
                return res
                  .status(500)
                  .json({ message: "Internal Server Error" });
              }

              const deletePaymentRequestQuery =
                "DELETE FROM payment_request WHERE id = ?";
              connection.query(
                deletePaymentRequestQuery,
                [id],
                async (error) => {
                  if (error) {
                    console.error(
                      "Error deleting state payment request:",
                      error
                    );
                    return res
                      .status(500)
                      .json({ message: "Internal Server Error" });
                  }

                  // Update the state handler's paymentRequestCount
                  const updateStateHandlerQuery =
                    "UPDATE create_sho SET paymentRequestCount = paymentRequestCount - 1 WHERE stateHandlerId = ?";
                  connection.query(
                    updateStateHandlerQuery,
                    [paymentRequest.userId],
                    async (error) => {
                      if (error) {
                        console.error("Error updating state handler:", error);
                        return res
                          .status(500)
                          .json({ message: "Internal Server Error" });
                      }

                      res.status(201).json({
                        message: "State payment request approved successfully",
                        bankName: userBankName, // Include the user's bank name in the response
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  } catch (error) {
    console.error("Error approving state payment request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchParticularPaymentApprove = async (req, res) => {
  try {
    const { userId } = req.body;

    // Query to fetch particular payment approvals for the given userId
    const fetchPaymentApprovalsQuery = `
      SELECT * FROM payment_approve
      WHERE userId = ?
    `;

    connection.query(
      fetchPaymentApprovalsQuery,
      [userId],
      async (error, results) => {
        if (error) {
          console.error("Error fetching payment approvals:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        // Return the list of payment approvals in the response
        res.status(200).json({ paymentApprovals: results });
      }
    );
  } catch (error) {
    console.error(
      "Error in fetch Particular Payment Approve try-catch block:",
      error
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.fetchPaymentRequestForAll = async (req, res) => {
  try {
    const { userId } = req.body;

    // Query to fetch payment requests for the given userId
    const fetchPaymentRequestsQuery =
      "SELECT * FROM payment_request WHERE userId = ?";

    connection.query(
      fetchPaymentRequestsQuery,
      [userId],
      async (error, results) => {
        if (error) {
          console.error("Error fetching payment requests:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        // if (results.length == 0) {
        //   return res.status(200).json({ message: "Payment request not found" });
        // }

        // Return the list of payment requests in the response
        res.status(200).json({ paymentRequests: results });
      }
    );
  } catch (error) {
    console.error("Error in fetchPaymentRrquest try-catch block:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//fetch all bd

exports.fetchAllBd = async (req, res) => {
  try {
    const findAllBdQuery = "SELECT* FROM create_bd";

    connection.query(findAllBdQuery, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length == 0) {
        return res
          .status(404)
          .json({ message: "No business developer found." });
      }

      return res
        .status(200)
        .json({ messagea: "All Business developers fetched", results });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// fetchParticularMemberWithdrawalRequest
exports.fetchParticularMemberWithdrawalRequest = async (req, res) => {
  const { memberId } = req.body;
  try {
    let query = "select * from payment_request where userId = ?";
    connection.query(query, [memberId], (err, results) => {
      if (!err) {
        return res.status(200).json({
          message: "Fetched Member Withdrawal Request to Admin successfully",
          data: results,
        });
      } else {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

// fetchParticularMemberApprovedWithdrawalHistory
exports.fetchParticularMemberApprovedWithdrawalHistory = async (req, res) => {
  let { memberId } = req.body;
  let query = "select * from payment_approve where userId =? ";
  connection.query(query, [memberId], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Partner Withdrawal History data successfully",
        memberWithdrawalHistory: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

exports.partnerPerMonthPayout = async (req, res) => {
  try {
    let memberReferred = "";
    let bdReferred = "";
    let franchiseReferred = "";
    let shoReferred = "";

    let referredId = "";

    const { userId, amount, requestDate } = req.body;

    if (!requestDate || !amount) {
      return res
        .status(422)
        .json({ mesaage: "Please provide date and amount." });
    }

    const findPartnerQuery = "select * from mining_partner where p_userid = ?";

    connection.query(findPartnerQuery, [userId], (error, result) => {
      if (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
      }

      const partner = result[0];

      referredId = partner.p_reffered_id;

      const insertPartnerRequestWalletHistory = `insert into partner_withdrawal (p_userid,partner_wallet, request_date  ) values(?,?,?)`;

      connection.query(
        insertPartnerRequestWalletHistory,
        [userId, amount, requestDate],
        (error, result) => {
          if (error) {
            console.log(error.message);
          }
        }
      );

      //check refererred id exist in member table or partner

      const findMember = "select * from create_member where reffer_id =?";

      connection.query(findMember, [referredId], (error, result) => {
        if (error) {
          console.log(error.message);
        }

        const member = result[0];
      });

      const findPartner = "select * from mining_partner where p_refferal_id =?";

      connection.query(findPartner, [referredId], (error, result) => {
        if (error) {
          console.log(error.message);
        }

        const refferredPartner = result[0];
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.approvePaymentRequestOfFranchise = async (req, res) => {
  try {
    const { id } = req.body;

    // Check if the payment request exists
    const checkPaymentRequestQuery =
      "SELECT * FROM payment_request WHERE id = ?";
    connection.query(checkPaymentRequestQuery, [id], async (error, results) => {
      if (error) {
        console.error("Error checking payment request:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Payment request not found." });
      }

      const paymentRequest = results[0];

      // Fetch the user's bank name
      const fetchUserBankQuery =
        "SELECT bank_name FROM bank_details WHERE user_id = ? AND isPrimary =1";
      connection.query(
        fetchUserBankQuery,
        [paymentRequest.userId],
        async (error, bankResults) => {
          if (error) {
            console.error("Error fetching user's bank name:", error);
            return res.status(500).json({ message: "Internal Server Error" });
          }

          if (bankResults.length === 0) {
            return res
              .status(400)
              .json({ message: "User's bank details not found" });
          }

          const userBankName = bankResults[0].bank_name;

          const insertPaymentApprovalQuery = `
          INSERT INTO payment_approve (userId, amount, requestDate, approveDate, bankName)
          VALUES (?, ?, ?, NOW(), ?)
        `;

          connection.query(
            insertPaymentApprovalQuery,
            [
              paymentRequest.userId,
              paymentRequest.amount,
              paymentRequest.requestDate,
              userBankName, // Include the user's bank name in the query
            ],
            async (error) => {
              if (error) {
                console.error("Error inserting payment approval:", error);
                return res
                  .status(500)
                  .json({ message: "Internal Server Error" });
              }

              const deletePaymentRequestQuery =
                "DELETE FROM payment_request WHERE id = ? ";
              connection.query(
                deletePaymentRequestQuery,
                [id],
                async (error) => {
                  if (error) {
                    console.error(
                      "Error deleting state payment request:",
                      error
                    );
                    return res
                      .status(500)
                      .json({ message: "Internal Server Error" });
                  }

                  // Update the state handler's paymentRequestCount
                  const updateFranchiseQuery =
                    "UPDATE create_franchise SET paymentRequestCount = paymentRequestCount - 1 WHERE franchiseId = ?";
                  connection.query(
                    updateFranchiseQuery,
                    [paymentRequest.userId],
                    async (error) => {
                      if (error) {
                        console.error("Error updating franchise:", error);
                        return res
                          .status(500)
                          .json({ message: "Internal Server Error" });
                      }

                      res.status(201).json({
                        message:
                          "Franchise payment request approved successfully",
                        bankName: userBankName,
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  } catch (error) {
    console.error("Error approving state payment request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.approvePaymentRequestOfBd = async (req, res) => {
  try {
    const { id } = req.body;

    // Check if the payment request exists
    const checkPaymentRequestQuery =
      "SELECT * FROM payment_request WHERE id = ?";
    connection.query(checkPaymentRequestQuery, [id], async (error, results) => {
      if (error) {
        console.error("Error checking payment request:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Payment request not found." });
      }

      const paymentRequest = results[0];

      // Fetch the user's bank name
      const fetchUserBankQuery =
        "SELECT bank_name FROM bank_details WHERE user_id = ? AND isPrimary =1";
      connection.query(
        fetchUserBankQuery,
        [paymentRequest.userId],
        async (error, bankResults) => {
          if (error) {
            console.error("Error fetching user's bank name:", error);
            return res.status(500).json({ message: "Internal Server Error" });
          }

          if (bankResults.length === 0) {
            return res
              .status(400)
              .json({ message: "User's bank details not found" });
          }

          const userBankName = bankResults[0].bank_name;

          const insertPaymentApprovalQuery = `
          INSERT INTO payment_approve (userId, amount, requestDate, approveDate, bankName)
          VALUES (?, ?, ?, NOW(), ?)
        `;

          connection.query(
            insertPaymentApprovalQuery,
            [
              paymentRequest.userId,
              paymentRequest.amount,
              paymentRequest.requestDate,
              userBankName, // Include the user's bank name in the query
            ],
            async (error) => {
              if (error) {
                console.error("Error inserting payment approval:", error);
                return res
                  .status(500)
                  .json({ message: "Internal Server Error" });
              }

              const deletePaymentRequestQuery =
                "DELETE FROM payment_request WHERE id = ?";
              connection.query(
                deletePaymentRequestQuery,
                [id],
                async (error) => {
                  if (error) {
                    console.error("Error deleting bd payment request:", error);
                    return res
                      .status(500)
                      .json({ message: "Internal Server Error" });
                  }

                  // Update the state handler's paymentRequestCount
                  const updateBdQuery =
                    "UPDATE create_bd SET paymentRequestCount = paymentRequestCount - 1 WHERE businessDeveloperId = ?";
                  connection.query(
                    updateBdQuery,
                    [paymentRequest.userId],
                    async (error) => {
                      if (error) {
                        console.error(
                          "Error updating business developer:",
                          error
                        );
                        return res
                          .status(500)
                          .json({ message: "Internal Server Error" });
                      }

                      res.status(201).json({
                        message:
                          "Business developer payment request approved successfully",
                        bankName: userBankName, // Include the user's bank name in the response
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  } catch (error) {
    console.error("Error approving state payment request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadAdharCardFrontSideMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files["adhar_front_side"]) {
      return res
        .status(400)
        .json({ message: "Aadhar card front side file is missing." });
    }

    const adharFrontSideFile = req.files["adhar_front_side"][0];

    const adharFrontSideLocation = adharFrontSideFile.location;

    const updatedData =
      "UPDATE create_member SET adhar_front_side = ? WHERE m_userid = ?";

    connection.query(
      updatedData,
      [adharFrontSideLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          res.status(200).json({
            message: "Adhar card front side uploaded successfully.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadAdharCardBackSideMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files["adhar_back_side"]) {
      return res
        .status(400)
        .json({ message: "Aadhar card back side file is missing." });
    }

    const adharBackSideFile = req.files["adhar_back_side"][0];

    const adharBackSideLocation = adharBackSideFile.location;

    const updatedData =
      "UPDATE create_member SET adhar_back_side = ? WHERE m_userid = ?";

    connection.query(
      updatedData,
      [adharBackSideLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          res.status(200).json({
            message: "Adhar card back side uploaded successfully.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadPanCardMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files["panCard"]) {
      return res.status(400).json({ message: "Pan card file is missing." });
    }

    const panCardFile = req.files["panCard"][0];

    const panCardLocation = panCardFile.location;

    const updatedData =
      "UPDATE create_member SET panCard = ? WHERE m_userid = ?";

    connection.query(
      updatedData,
      [panCardLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          res.status(200).json({
            message: "Pan Card uploaded successfully.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadAdharCardFrontSideBd = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files["adhar_front_side"]) {
      return res
        .status(400)
        .json({ message: "Aadhar card front side file is missing." });
    }

    const adharFrontSideFile = req.files["adhar_front_side"][0];

    const adharFrontSideLocation = adharFrontSideFile.location;

    const updatedData =
      "UPDATE create_bd SET adhar_front_side = ? WHERE businessDeveloperId = ?";

    connection.query(
      updatedData,
      [adharFrontSideLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          res.status(200).json({
            message: "Adhar card front side uploaded successfully.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadAdharCardBackSideBd = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files["adhar_back_side"]) {
      return res
        .status(400)
        .json({ message: "Aadhar card back side file is missing." });
    }

    const adharBackSideFile = req.files["adhar_back_side"][0];

    const adharBackSideLocation = adharBackSideFile.location;

    const updatedData =
      "UPDATE create_bd SET adhar_back_side = ? WHERE businessDeveloperId = ?";

    connection.query(
      updatedData,
      [adharBackSideLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          res.status(200).json({
            message: "Adhar card back side uploaded successfully.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadPanCardBd = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files["panCard"]) {
      return res.status(400).json({ message: "Pan card file is missing." });
    }

    const panCardFile = req.files["panCard"][0];

    const panCardLocation = panCardFile.location;

    const updatedData =
      "UPDATE create_bd SET panCard = ? WHERE businessDeveloperId = ?";

    connection.query(
      updatedData,
      [panCardLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          res.status(200).json({
            message: "Pan Card uploaded successfully.",
            // panCardFile: panCardLocation,// to send file in response
          });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uplaodAdharCardFrontSideFranchise = async (req, res) => {
  const { userId } = req.body;
  try {
    if (!req.files["adhar_front_side"]) {
      return res
        .status(400)
        .json({ message: "Aadhar card front side file is missing." });
    }

    const adharFrontLocation = req.files["adhar_front_side"][0].location;

    const updatedData =
      "update create_franchise set adhar_front_side = ?  where franchiseId = ? ";

    connection.query(
      updatedData,
      [adharFrontLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          return res
            .status(200)
            .json({ message: "Adhar card front side uploaded successfully" });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadAdharCardBackSideFranchise = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files["adhar_back_side"]) {
      return res
        .status(400)
        .json({ message: "Aadhar card back side file is missing." });
    }

    const adharBackSideFile = req.files["adhar_back_side"][0];

    const adharBackSideLocation = adharBackSideFile.location;

    const updatedData =
      "UPDATE create_franchise SET adhar_back_side = ? WHERE franchiseId = ?";

    connection.query(
      updatedData,
      [adharBackSideLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          res.status(200).json({
            message: "Adhar card back side uploaded successfully.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadPanCardFranchise = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files["panCard"]) {
      return res.status(400).json({ message: "Pan card file is missing." });
    }

    const panCardFile = req.files["panCard"][0];

    const panCardLocation = panCardFile.location;

    const updatedData =
      "UPDATE create_franchise SET panCard = ? WHERE franchiseId = ?";

    connection.query(
      updatedData,
      [panCardLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          res.status(200).json({
            message: "Pan Card uploaded successfully.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uplaodAdharCardFrontSideSho = async (req, res) => {
  const { userId } = req.body;
  try {
    if (!req.files["adhar_front_side"]) {
      return res
        .status(400)
        .json({ message: "Aadhar card front side file is missing." });
    }

    const adharFrontLocation = req.files["adhar_front_side"][0].location;

    const updatedData =
      "update create_sho set adhar_front_side = ?  where stateHandlerId = ? ";

    connection.query(
      updatedData,
      [adharFrontLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          return res
            .status(200)
            .json({ message: "Adhar card front side uploaded successfully" });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadAdharCardBackSideSho = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files["adhar_back_side"]) {
      return res
        .status(400)
        .json({ message: "Aadhar card back side file is missing." });
    }

    const adharBackSideFile = req.files["adhar_back_side"][0];

    const adharBackSideLocation = adharBackSideFile.location;

    const updatedData =
      "UPDATE create_sho SET adhar_back_side = ? WHERE stateHandlerId = ?";

    connection.query(
      updatedData,
      [adharBackSideLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          res.status(200).json({
            message: "Adhar card back side uploaded successfully.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadPanCardSho = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files["panCard"]) {
      return res.status(400).json({ message: "Pan card file is missing." });
    }

    const panCardFile = req.files["panCard"][0];

    const panCardLocation = panCardFile.location;

    const updatedData =
      "UPDATE create_sho SET panCard = ? WHERE stateHandlerId = ?";

    connection.query(
      updatedData,
      [panCardLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          res.status(200).json({
            message: "Pan Card uploaded successfully.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uplaodAdharCardFrontSidePartner = async (req, res) => {
  const { userId } = req.body;
  try {
    if (!req.files["adhar_front_side"]) {
      return res
        .status(400)
        .json({ message: "Aadhar card front side file is missing." });
    }

    const adharFrontLocation = req.files["adhar_front_side"][0].location;

    const updatedData =
      "update mining_partner set adhar_front_side = ?  where p_userid = ? ";

    connection.query(
      updatedData,
      [adharFrontLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          return res
            .status(200)
            .json({ message: "Adhar card front side uploaded successfully" });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uplaodAdharCardBackSidePartner = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files["adhar_back_side"]) {
      return res
        .status(400)
        .json({ message: "Aadhar card back side file is missing." });
    }

    const adharBackSideFile = req.files["adhar_back_side"][0];

    const adharBackSideLocation = adharBackSideFile.location;

    const updatedData =
      "UPDATE mining_partner SET adhar_back_side = ? WHERE p_userid = ?";

    connection.query(
      updatedData,
      [adharBackSideLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          res.status(200).json({
            message: "Adhar card back side uploaded successfully.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadPanCardPartner = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files["panCard"]) {
      return res.status(400).json({ message: "Pan card file is missing." });
    }

    const panCardFile = req.files["panCard"][0];

    const panCardLocation = panCardFile.location;

    const updatedData =
      "UPDATE mining_partner SET panCard = ? WHERE p_userid = ?";

    connection.query(
      updatedData,
      [panCardLocation, userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Internal server error" });
        } else {
          res.status(200).json({
            message: "Pan Card uploaded successfully.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadBond = async (req, res) => {
  try {
    const { rigId } = req.body;

    if (!req.files["bond"]) {
      return res.status(400).json({ message: "Bond file is missing." });
    }
    if (!req.files["invoice"]) {
      return res.status(400).json({ message: "Invoice file is missing." });
    }
    const bondFile = req.files["bond"][0];
    const invoiceFile = req.files["invoice"][0];

    const bondLocation = bondFile.location;
    const invoiceLocation = invoiceFile.location;
    // Check if the file is a PDF
    if (
      bondFile.mimetype !== "application/pdf" ||
      invoiceFile.mimetype !== "application/pdf"
    ) {
      return res
        .status(400)
        .json({ message: "Bond File or Invoice File must be in PDF format." });
    }

    const [isRigIdExistInMiningPartner] = await connection
      .promise()
      .query("SELECT rigId FROM mining_partner WHERE rigId = ?", [rigId]);

    if (isRigIdExistInMiningPartner.length > 0) {
      await connection
        .promise()
        .query(
          "UPDATE mining_partner SET bond = ?, invoice = ? WHERE rigId = ?",
          [bondLocation, invoiceLocation, rigId]
        );
    } else {
      await connection
        .promise()
        .query(
          "UPDATE multiple_rig_partner SET bond = ?, invoice = ? WHERE rigId = ?",
          [bondLocation, invoiceLocation, rigId]
        );
    }

    return res.status(200).json({ message: "File uploaded successfully." });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//fetch bond
exports.fetchBond = async (req, res) => {
  try {
    const userId = req.body.userId; // Extract partner ID from query parameters

    const findBondQuery = `
      SELECT * FROM upload_bond WHERE userId = ?
    `;

    connection.query(findBondQuery, [userId], (error, result) => {
      if (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "No data found for the provided partner ID" });
      }

      return res
        .status(200)
        .json({ message: "Bond file fetched successfully", data: result });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.queryResolve = async (req, res) => {
  try {
    const { status, id } = req.body;

    const updateStatus = "UPDATE help_and_support SET status = ? WHERE id = ?";

    connection.query(updateStatus, [status, id], (error, result) => {
      if (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error." });
      }

      if (result.affectedRows === 1) {
        if (status === true) {
          return res
            .status(200)
            .json({ message: "Query resolved successfully" });
        } else if (status === false) {
          return res
            .status(200)
            .json({ message: "Query status changed to false" });
        }
      } else {
        return res
          .status(200)
          .json({ message: "No matching query found for update" });
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchQuery = async (req, res) => {
  try {
    const { p_userid } = req.body;

    if (!p_userid) {
      return res
        .status(400)
        .json({ message: "Missing p_userid in the request." });
    }

    const fetchQuerySQL = "SELECT * FROM help_and_support WHERE p_userid = ?";

    connection.query(fetchQuerySQL, [p_userid], (error, result) => {
      if (error) {
        console.log(error.message);
        return res
          .status(500)
          .json({ message: "Failed to fetch queries. Internal server error." });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "No queries found for the given p_userid." });
      }

      return res
        .status(200)
        .json({ message: "Queries fetched successfully.", data: result });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// memberReferralPayoutHistory
exports.memberReferralPayoutHistory = async (req, res) => {
  const { userid, userType } = req.body;
  let query = "select * from my_team where userid = ? and userType = ?";
  connection.query(query, [userid, userType], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Referral Payout History Fetched Successfully ",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchUnVerifiedMember
exports.fetchUnVerifiedMember = async (req, res) => {
  let query =
    "select * FROM create_member WHERE isVerify = 0 AND priority = 1 ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "All unVerified Member Fetched successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchUnVerifiedFranchise
exports.fetchUnVerifiedFranchise = async (req, res) => {
  let query =
    "select * FROM create_franchise WHERE isVerify = 0 AND priority = 1 ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "All unVerified Franchise Fetched successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchUnVerifiedBmm
exports.fetchUnVerifiedBmm = async (req, res) => {
  let query = "select * FROM create_sho WHERE isVerify = 0 AND priority = 1 ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "All unVerified BMM Fetched successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchVerifiedMember
exports.fetchVerifiedMember = async (req, res) => {
  let query =
    "select * FROM create_member WHERE isVerify = 1 AND priority = 1 ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "All Verified Franchise Fetched successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchVerifiedBmm
exports.fetchVerifiedBmm = async (req, res) => {
  let query = "select * FROM create_sho WHERE isVerify = 1 ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "All Verified BMM Fetched successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchVerifiedFranchise
exports.fetchVerifiedFranchise = async (req, res) => {
  let query =
    "select * FROM create_franchise WHERE isVerify = 1 AND priority = 1 ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "All Verified Franchise Fetched successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchUpgradeDowngradeFranchise
exports.fetchUpgradeDowngradeFranchise = async (req, res) => {
  let query =
    "select * FROM create_franchise WHERE isVerify = 0 AND priority = 0 ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "All upgrade/downgrade Franchise Fetched successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchUpgradeDowngradeBmm
exports.fetchUpgradeDowngradeBmm = async (req, res) => {
  let query = "select * FROM create_sho WHERE isVerify = 0 AND priority = 0 ";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "All upgrade/downgrade BMM Fetched successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

exports.createPartnerPayout = async (req, res) => {
  try {
    const { rigId, payableAmount, payoutDate, liquidity, partnerId } = req.body;

    if (!payableAmount || !payoutDate) {
      return res
        .status(400)
        .json({ message: "Payable amount and Payout Date are required." });
    }

    // Check if rigId already exists in the table
    const [existingResult] = await connection
      .promise()
      .query(
        "SELECT payableCount,payoutDate  FROM partner_payout WHERE rigId = ?",
        [rigId]
      );

    let newPayableCount = 1;
    let lastPayoutDate;

    if (existingResult.length > 0) {
      // If rigId exists, increment payableCount by 1
      newPayableCount =
        existingResult[existingResult.length - 1].payableCount + 1;
      console.log(newPayableCount, 4612);

      lastPayoutDate = existingResult[existingResult.length - 1].payoutDate;
      console.log(lastPayoutDate, 4614);

      // const providedMonth = new Date(payoutDate).getMonth();

      // const lastMonth = new Date(lastPayoutDate).getMonth();

      // if (providedMonth === lastMonth) {
      //   return res
      //     .status(400)
      //     .json({ message: "Payout for this month has already happened." });
      // }
    }

    // Insert a new row
    const insertQuery =
      "INSERT INTO partner_payout (rigId, payableAmount, payoutDate, payableCount, liquidity, partnerId) VALUES (?, ?, ?, ?, ?, ?)";
    await connection
      .promise()
      .query(insertQuery, [
        rigId,
        payableAmount,
        payoutDate,
        newPayableCount,
        liquidity,
        partnerId,
      ]);

    return res
      .status(200)
      .json({ message: "New partner payout created successfully." });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Fetch partner payouts by rigId
exports.fetchPartnerPayouts = async (req, res) => {
  try {
    const { rigId } = req.body;

    if (!rigId) {
      return res.status(400).json({ message: "Rig ID is required." });
    }

    // Fetch partner payouts for a specific rigId
    const [partnerPayouts] = await connection
      .promise()
      .query("SELECT * FROM partner_payout WHERE rigId = ?", [rigId]);

    return res.status(200).json({
      message: "Partner Payout fetched successfully",
      data: partnerPayouts,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.fetchPartnerByRigId = async (req, res) => {
  try {
    const { rigId } = req.body;

    const miningPartnerQuery = "SELECT * FROM mining_partner WHERE rigId = ?";
    const [miningPartnerResult] = await connection
      .promise()
      .query(miningPartnerQuery, [rigId]);

    if (miningPartnerResult.length > 0) {
      console.log("first");
      return res.status(200).json({
        message: "Mining Partner fetched successfully.",
        data: miningPartnerResult,
      });
    } else {
      console.log("111111");
      const multipleRigPartnerQuery =
        "SELECT * FROM multiple_rig_partner WHERE rigId = ?";
      const [multipleRigPartnerResult] = await connection
        .promise()
        .query(multipleRigPartnerQuery, [rigId]);

      if (multipleRigPartnerResult.length > 0) {
        return res.status(200).json({
          message: "Multiple Rig Partner fetched successfully.",
          data: multipleRigPartnerResult,
        });
      } else {
        return res
          .status(404)
          .json({ message: "No partner found for the provided rigId." });
      }
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.fetchTotalReferralCountAndTodayReferralCount = async (req, res) => {
  try {
    // Fetch total member referral count
    const totalMemberReferralQuery =
      "SELECT COUNT(*) AS totalReferralCount FROM create_member WHERE isVerify = 1";
    const totalMemberReferralResult = await connection
      .promise()
      .query(totalMemberReferralQuery);
    const totalMemberReferralCount =
      totalMemberReferralResult[0][0].totalReferralCount;

    // Fetch today's member referral count
    const todayMemberReferralQuery =
      "SELECT COUNT(*) AS todayReferralCount FROM create_member WHERE isVerify = 1 AND DATE(verifyDate) = CURDATE()";
    const todayMemberReferralResult = await connection
      .promise()
      .query(todayMemberReferralQuery);
    const todayMemberReferralCount =
      todayMemberReferralResult[0][0].todayReferralCount;

    // Fetch total partner count
    const totalPartnerQuery =
      "SELECT COUNT(*) AS totalPartnerCount FROM mining_partner WHERE isVerify = 1";
    const totalPartnerResult = await connection
      .promise()
      .query(totalPartnerQuery);
    const totalPartnerCount = totalPartnerResult[0][0].totalPartnerCount;

    // Fetch today's partner count
    const todayPartnerQuery =
      "SELECT COUNT(*) AS todayPartnerCount FROM mining_partner WHERE isVerify = 1 AND DATE(verifyDate) = CURDATE()";
    const todayPartnerResult = await connection
      .promise()
      .query(todayPartnerQuery);
    const todayPartnerCount = todayPartnerResult[0][0].todayPartnerCount;

    // Fetch total mining RIG partner count

    const totalMultipleRIGPartnerQuery =
      "SELECT COUNT(*) AS totalMultipleRIGPartnerCount FROM multiple_rig_partner WHERE isVerify = 1";
    const totalMultipleRIGPartnerResult = await connection
      .promise()
      .query(totalMultipleRIGPartnerQuery);
    const totalMultipleRIGPartnerCount =
      totalMultipleRIGPartnerResult[0][0].totalMultipleRIGPartnerCount;

    // Fetch today's mining partner count
    const todayMultipleRIGPartnerQuery =
      "SELECT COUNT(*) AS todayMultiplRIGPartnerCount FROM multiple_rig_partner WHERE isVerify = 1 AND DATE(verifyDate) = CURDATE()";
    const todayMultipleRIGPartnerResult = await connection
      .promise()
      .query(todayMultipleRIGPartnerQuery);
    const todayMultipleRIGPartnerCount =
      todayMultipleRIGPartnerResult[0][0].todayMultiplRIGPartnerCount;

    // Fetch total franchise count
    const totalFranchiseQuery =
      "SELECT COUNT(*) AS totalFranchiseCount FROM create_franchise WHERE isVerify = 1";
    const totalFranchiseResult = await connection
      .promise()
      .query(totalFranchiseQuery);
    const totalFranchiseCount = totalFranchiseResult[0][0].totalFranchiseCount;

    // Fetch today's franchise count
    const todayFranchiseQuery =
      "SELECT COUNT(*) AS todayFranchiseCount FROM create_franchise WHERE isVerify = 1 AND DATE(verifyDate) = CURDATE()";
    const todayFranchiseResult = await connection
      .promise()
      .query(todayFranchiseQuery);
    const todayFranchiseCount = todayFranchiseResult[0][0].todayFranchiseCount;

    // Fetch total BMM count
    const totalBMMQuery =
      "SELECT COUNT(*) AS totalBMMCount FROM create_sho WHERE isVerify = 1";
    const totalBMMResult = await connection.promise().query(totalBMMQuery);
    const totalBMMCount = totalBMMResult[0][0].totalBMMCount;

    // Fetch today's BMM count
    const todayBMMQuery =
      "SELECT COUNT(*) AS todayBMMCount FROM create_sho WHERE isVerify = 1 AND DATE(verifyDate) = CURDATE()";
    const todayBMMResult = await connection.promise().query(todayBMMQuery);
    const todayBMMCount = todayBMMResult[0][0].todayBMMCount;

    return res.status(200).json({
      totalReferralCount: totalMemberReferralCount,
      todayReferralCount: todayMemberReferralCount,
      totalPartnerCount,
      todayPartnerCount,
      totalMultipleRIGPartnerCount,
      todayMultipleRIGPartnerCount,
      totalFranchiseCount,
      todayFranchiseCount,
      totalBMMCount,
      todayBMMCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

exports.fetchTransactionHistory = async (req, res) => {
  try {
    const { currentDate, currentMonth, currentYear } = req.body;

    let fetchTransactionQuery = "SELECT * FROM partner_payout WHERE 1=1";
    const queryParams = [];

    if (currentDate) {
      fetchTransactionQuery += " AND DATE(payoutDate) = ?";
      queryParams.push(currentDate);
    }

    if (currentMonth && currentYear) {
      fetchTransactionQuery +=
        " AND MONTH(payoutDate) = ? AND YEAR(payoutDate) = ?";
      queryParams.push(currentMonth, currentYear);
    }

    const [transactionHistory] = await connection
      .promise()
      .query(fetchTransactionQuery, queryParams);

    if (!transactionHistory || transactionHistory.length === 0) {
      return res.status(200).json({
        message: "No Transaction History Found",
        data: [],
      });
    }

    // Fetch names from mining_partner for each partnerId
    for (const transaction of transactionHistory) {
      const [partnerNames] = await connection
        .promise()
        .query(
          "SELECT p_name, p_lname FROM mining_partner WHERE p_userid = ?",
          [transaction.partnerId]
        );

      if (partnerNames.length > 0) {
        transaction.p_name = partnerNames[0].p_name;
        transaction.p_lname = partnerNames[0].p_lname;
      } else {
        transaction.p_name = null;
        transaction.p_lname = null;
      }
    }

    return res.status(200).json({
      message: "Transaction history fetched successfully",
      data: transactionHistory,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.createPartnerPayoutForMonthly = async (req, res) => {
  try {
    const {
      rigId,
      payableAmount,
      payoutDate,
      liquidity,
      partnerId,
      referralAmount,
    } = req.body;
    console.log("rigid", rigId);

    findPartnerReferralQuery =
      "select p_reffered_id from mining_partner where p_userid = ?";

    const [partnerResult] = await connection
      .promise()
      .query(findPartnerReferralQuery, [partnerId]);

    const partnerReferredId = partnerResult[0].p_reffered_id;
    console.log(partnerReferredId, "partnerRefelll");

    findMemberQuery = "select m_userid from create_member where reffer_id =?";

    const [findMemberIdResult] = await connection
      .promise()
      .query(findMemberQuery, [partnerReferredId]);

    const memberId = findMemberIdResult[0].m_userid;

    console.log(memberId, "memberId");

    // Check if a record already exists for the user and month in my_team table
    // const checkDuplicateQuery =
    //   "SELECT rigId FROM my_team WHERE rigId = ? AND MONTH(credit_date) = MONTH(?) AND YEAR(credit_date) = YEAR(?)";
    // const [existingTeamResult] = await connection
    //   .promise()
    //   .query(checkDuplicateQuery, [rigId, payoutDate, payoutDate]);

    // if (existingTeamResult.length > 0) {
    //   console.log("existingTeamResult",existingTeamResult[0])
    //   return res.status(400).json({
    //     message: "Payout for this month has already happened for referral.",
    //   });
    // }

    // Insert a new rowin referral_payout table
    const referralPayoutInsertQuery =
      "INSERT INTO my_team (userid, amount, credit_date, partnerid,rigId, userType) VALUES (?, ?, ?, ?,?, 'MEMBER')";
    await connection
      .promise()
      .query(referralPayoutInsertQuery, [
        memberId,
        referralAmount,
        payoutDate,
        partnerId,
        rigId,
      ]);

    if (!payableAmount || !payoutDate) {
      return res
        .status(400)
        .json({ message: "Payable amount and Payout Date are required." });
    }

    // Check if rigId already exists in the table
    const [existingResult] = await connection
      .promise()
      .query(
        "SELECT payableCount,payoutDate  FROM partner_payout WHERE rigId = ?",
        [rigId]
      );

    let newPayableCount = 1;
    let lastPayoutDate;

    if (existingResult.length > 0) {
      // If rigId exists, increment payableCount by 1
      newPayableCount =
        existingResult[existingResult.length - 1].payableCount + 1;
      console.log(newPayableCount, 4612);

      lastPayoutDate = existingResult[existingResult.length - 1].payoutDate;
      console.log(lastPayoutDate, 4614);

      const providedMonth = new Date(payoutDate).getMonth();

      const lastMonth = new Date(lastPayoutDate).getMonth();
      // if (providedMonth === lastMonth) {
      //   return res.status(400).json({
      //     message:
      //       "Payout for this month has already happened for RIG partner.",
      //   });
      // }
    }

    // Insert a new row
    const insertQuery =
      "INSERT INTO partner_payout (rigId, payableAmount, payoutDate, payableCount, liquidity, partnerId) VALUES (?, ?, ?, ?, ?, ?)";
    await connection
      .promise()
      .query(insertQuery, [
        rigId,
        payableAmount,
        payoutDate,
        newPayableCount,
        liquidity,
        partnerId,
      ]);

    return res
      .status(200)
      .json({ message: "New partner payout created successfully." });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.verifyMultipleRigPartner = async (req, res) => {
  try {
    const { rigId } = req.body;

    let latestInvoiceNumber;

    // Fetch the maximum invoice number from both tables
    const [fetchMiningPartnerLatestData] = await connection
      .promise()
      .query(
        "SELECT MAX(invoice_number) AS max_invoice_number FROM mining_partner"
      );

    const partnerInvoiceNumber =
      fetchMiningPartnerLatestData[0].max_invoice_number || "00000";

    const [fetchMultipleMiningPartnerLatestData] = await connection
      .promise()
      .query(
        "SELECT MAX(invoice_number) AS max_invoice_number FROM multiple_rig_partner"
      );

    const multipleInvoiceNumber =
      fetchMultipleMiningPartnerLatestData[0].max_invoice_number || "00000";

    // Determine the latest invoice number
    latestInvoiceNumber =
      Math.max(partnerInvoiceNumber, multipleInvoiceNumber) + 1;

    // Format the invoice number with leading zeros
    const formattedInvoiceNumber = latestInvoiceNumber
      .toString()
      .padStart(5, "0");

    const selectPartnerQuery =
      "SELECT rigId FROM mining_partner WHERE rigId = ?";
    const [partnerInMiningResult] = await connection
      .promise()
      .query(selectPartnerQuery, [rigId]);

    let updateQuery;

    if (partnerInMiningResult.length > 0) {
      updateQuery =
        "UPDATE mining_partner SET invoice_number=?, isVerify = 1, verifyDate = NOW() WHERE rigId = ?";
    } else {
      updateQuery =
        "UPDATE multiple_rig_partner SET invoice_number=?, isVerify = 1, verifyDate = NOW() WHERE rigId = ?";
    }

    // Update the record with the new invoice number
    await connection
      .promise()
      .query(updateQuery, [formattedInvoiceNumber, rigId]);

    return res
      .status(200)
      .json({ message: "RIG partner successfully verified." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// exports.fetchReferralPayoutHistoryAdmin = async (req, res) => {
//   try {
//     const { currentDate, currentMonth, currentYear } = req.body;

//     let fetchTransactionQueryTeam = "SELECT * FROM my_team WHERE 1=1";

//     const queryParamsTeam = [];

//     if (currentDate) {
//       fetchTransactionQueryTeam += " AND DATE(credit_date) = ?";
//       queryParamsTeam.push(currentDate);
//     }

//     if (currentMonth && currentYear) {
//       fetchTransactionQueryTeam +=
//         " AND MONTH(transactionDate) = ? AND YEAR(credit_date) = ?";
//       queryParamsTeam.push(currentMonth, currentYear);
//     }

//     const [transactionHistoryTeam] = await connection
//       .promise()
//       .query(fetchTransactionQueryTeam, queryParamsTeam);

//     return res.status(200).json({
//       message: "Referral Payout History fetched successfully",
//       data: transactionHistoryTeam,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };

// ------------------new way to get the liquidity and ----------

exports.fetchReferralPayoutHistoryAdmin = async (req, res) => {
  try {
    const { currentDate, currentMonth, currentYear } = req.body;

    let fetchTransactionQueryTeam = "SELECT * FROM my_team WHERE 1=1";

    const queryParamsTeam = [];

    if (currentDate) {
      fetchTransactionQueryTeam += " AND DATE(credit_date) = ?";
      queryParamsTeam.push(currentDate);
    }

    if (currentMonth && currentYear) {
      fetchTransactionQueryTeam +=
        " AND MONTH(credit_date) = ? AND YEAR(credit_date) = ?";
      queryParamsTeam.push(currentMonth, currentYear);
    }

    const [transactionHistoryTeam] = await connection
      .promise()
      .query(fetchTransactionQueryTeam, queryParamsTeam);

    // Fetch names from mining_partner for each partnerid
    for (const transaction of transactionHistoryTeam) {
      const [miningPartner] = await connection
        .promise()
        .query(
          "SELECT p_name, p_lname FROM mining_partner WHERE p_userid = ?",
          [transaction.partnerid]
        );

      if (miningPartner.length > 0) {
        transaction.p_name = miningPartner[0].p_name;
        transaction.p_lname = miningPartner[0].p_lname;
      } else {
        transaction.p_name = null;
        transaction.p_lname = null;
      }

      // Fetch names from create_member for each userid
      const [createMember] = await connection
        .promise()
        .query("SELECT m_name, m_lname FROM create_member WHERE m_userid = ?", [
          transaction.userid,
        ]);

      if (createMember.length > 0) {
        transaction.m_name = createMember[0].m_name;
        transaction.m_lname = createMember[0].m_lname;
      } else {
        transaction.m_name = null;
        transaction.m_lname = null;
      }
    }

    return res.status(200).json({
      message: "Referral Payout History fetched successfully",
      data: transactionHistoryTeam,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};





// ----------------------------------------------------------------//

// exports.fliterPayoutTotalAndMonthlyWise = async (req, res) => {
//   try {
//     // Partner payout table
//     const fetchPartnerPayout = "SELECT * FROM partner_payout";
//     const [partnerPayOutResult] = await connection.promise().query(fetchPartnerPayout);

//     const totalPartnerAmount = partnerPayOutResult.reduce((total, partner) => {
//       const payableAmount = partner.payableAmount;
//       return total + payableAmount;
//     }, 0);

//     // My team table (bmm, franchise, member)
//     const fetchMyTeam = "SELECT * FROM my_team";
//     const [myTeamResult] = await connection.promise().query(fetchMyTeam);

//     // Initialize variables for userType-wise total amounts
//     let totalBMMAmount = 0;
//     let totalFranchiseAmount = 0;
//     let totalMemberAmount = 0;
//     let totalReferPartnerAmount = 0;

//     const totalMyTeamAmount = myTeamResult.reduce((total, myTeam) => {
//       const payableAmount = myTeam.amount;

//       // Update userType-wise totals based on the user type
//       switch (myTeam.userType) {
//         case "BMM":
//           totalBMMAmount += payableAmount;
//           break;
//         case "FRANCHISE":
//           totalFranchiseAmount += payableAmount;
//           break;
//         case "MEMBER":
//           totalMemberAmount += payableAmount;
//           break;
//         case "PARTNER":
//           totalReferPartnerAmount += payableAmount;
//           break;
//         // Handle other user types if needed
//       }

//       return total + payableAmount;
//     }, 0);

//     // Calculate monthly wise amounts in the partner table
//     const monthlyWisePartnerAmount = partnerPayOutResult.reduce(
//       (monthlyAmounts, partner) => {
//         const payoutDate = moment(partner.payoutDate).format("YYYY-MM");
//         monthlyAmounts[payoutDate] =
//           (monthlyAmounts[payoutDate] || 0) + partner.payableAmount;
//         return monthlyAmounts;
//       },
//       {}
//     );

//     // Calculate monthly wise amounts in my_team (bmm, franchise, and member)
//     const monthlyWiseMyTeamAmount = myTeamResult.reduce(
//       (monthlyAmounts, myTeam) => {
//         const payoutDate = moment(myTeam.credit_date).format("YYYY-MM");
//         monthlyAmounts[payoutDate] =
//           (monthlyAmounts[payoutDate] || 0) + myTeam.amount;
//         return monthlyAmounts;
//       },
//       {}
//     );

//     // Combine monthly amounts from both tables for the same month and year
//     const combinedMonthlyAmounts = {};

//     // Get all unique keys from both monthlyWisePartnerAmount and monthlyWiseMyTeamAmount
//     const allKeys = new Set([
//       ...Object.keys(monthlyWisePartnerAmount),
//       ...Object.keys(monthlyWiseMyTeamAmount),
//     ]);

//     // Combine data for each unique key
//     allKeys.forEach((monthYear) => {
//       combinedMonthlyAmounts[monthYear] = {
//         partnerAmount: monthlyWisePartnerAmount[monthYear] || 0,
//         myTeamAmount: monthlyWiseMyTeamAmount[monthYear] || 0,
//       };
//     });

//     console.log(combinedMonthlyAmounts, "5224");

//     return res.status(200).json({
//       mesaage: "fetched filter payout",
//       totalPartnerPayoutAmount:totalPartnerAmount,
//       totalAmount: totalPartnerAmount + totalMyTeamAmount,
//       totalAmountByUserType: {
//         BMM: totalBMMAmount,
//         FRANCHISE: totalFranchiseAmount,
//         MEMBER: totalMemberAmount,
//         PARTNER: totalReferPartnerAmount,
//       },
//       combinedMonthlyAmounts,
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ mesaage: "Internal server error" });
//   }
// };

// exports.fliterPayoutTotalAndMonthlyWise = async (req, res) => {
//   try {
//     // Partner payout table
//     const fetchPartnerPayout = "SELECT * FROM partner_payout";
//     const [partnerPayOutResult] = await connection.promise().query(fetchPartnerPayout);

//     const totalPartnerAmount = partnerPayOutResult.reduce((total, partner) => {
//       const payableAmount = partner.payableAmount;
//       return total + payableAmount;
//     }, 0);

//     // My team table (bmm, franchise, member)
//     const fetchMyTeam = "SELECT * FROM my_team";
//     const [myTeamResult] = await connection.promise().query(fetchMyTeam);

//     // Initialize variables for userType-wise total amounts
//     let totalBMMAmount = 0;
//     let totalFranchiseAmount = 0;
//     let totalMemberAmount = 0;
//     let totalReferPartnerAmount = 0;

//     const totalMyTeamAmount = myTeamResult.reduce((total, myTeam) => {
//       const payableAmount = myTeam.amount;

//       // Update userType-wise totals based on the user type
//       switch (myTeam.userType) {
//         case "BMM":
//           totalBMMAmount += payableAmount;
//           break;
//         case "FRANCHISE":
//           totalFranchiseAmount += payableAmount;
//           break;
//         case "MEMBER":
//           totalMemberAmount += payableAmount;
//           break;
//         case "PARTNER":
//           totalReferPartnerAmount += payableAmount;
//           break;
//         // Handle other user types if needed
//       }

//       return total + payableAmount;
//     }, 0);

//     // Calculate monthly wise amounts in the partner table
//     const monthlyWisePartnerAmount = partnerPayOutResult.reduce(
//       (monthlyAmounts, partner) => {
//         const payoutDate = moment(partner.payoutDate).format("YYYY-MM");
//         monthlyAmounts[payoutDate] =
//           (monthlyAmounts[payoutDate] || 0) + partner.payableAmount;
//         return monthlyAmounts;
//       },
//       {}
//     );

//     // Calculate monthly wise amounts in my_team (bmm, franchise, and member)
//     const monthlyWiseMyTeamAmount = myTeamResult.reduce(
//       (monthlyAmounts, myTeam) => {
//         const payoutDate = moment(myTeam.credit_date).format("YYYY-MM");
//         monthlyAmounts[payoutDate] =
//           (monthlyAmounts[payoutDate] || 0) + myTeam.amount;

//         // Update userType-wise monthly totals based on the user type
//         if (!monthlyAmounts[myTeam.userType]) {
//           monthlyAmounts[myTeam.userType] = {};
//         }
//         monthlyAmounts[myTeam.userType][payoutDate] =
//           (monthlyAmounts[myTeam.userType][payoutDate] || 0) + myTeam.amount;

//         return monthlyAmounts;
//       },
//       {}
//     );

//     // Combine monthly amounts from both tables for the same month and year
//     const combinedMonthlyAmounts = {};

//     // Get all unique keys from both monthlyWisePartnerAmount and monthlyWiseMyTeamAmount
//     const allKeys = new Set([
//       ...Object.keys(monthlyWisePartnerAmount),
//       ...Object.keys(monthlyWiseMyTeamAmount),
//     ]);

//     // Combine data for each unique key
//     allKeys.forEach((monthYear) => {
//       combinedMonthlyAmounts[monthYear] = {
//         totalAmount: (monthlyWisePartnerAmount[monthYear] || 0) + (monthlyWiseMyTeamAmount[monthYear] || 0),
//         partnerAmount: monthlyWisePartnerAmount[monthYear] || 0,
//         myTeamAmount: monthlyWiseMyTeamAmount[monthYear] || 0,
//         userTypeAmounts: {
//           BMM: monthlyWiseMyTeamAmount['BMM']?.[monthYear] || 0,
//           FRANCHISE: monthlyWiseMyTeamAmount['FRANCHISE']?.[monthYear] || 0,
//           MEMBER: monthlyWiseMyTeamAmount['MEMBER']?.[monthYear] || 0,
//           PARTNER: monthlyWiseMyTeamAmount['PARTNER']?.[monthYear] || 0,
//         },
//       };
//     });

//     console.log(combinedMonthlyAmounts, "5224");

//     return res.status(200).json({
//       mesaage: "fetched filter payout",
//       totalPartnerAmount,
//       totalAmount: totalPartnerAmount + totalMyTeamAmount,
//       totalAmountByUserType: {
//         BMM: totalBMMAmount,
//         FRANCHISE: totalFranchiseAmount,
//         MEMBER: totalMemberAmount,
//         PARTNER: totalReferPartnerAmount,
//       },
//       combinedMonthlyAmounts,
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ mesaage: "Internal server error" });
//   }
// };

exports.fliterPayoutTotalAndMonthlyWise = async (req, res) => {
  try {
    // partner payout table
    const fetchPartnerPayout = "SELECT * FROM partner_payout";
    const [partnerPayOutResult] = await connection
      .promise()
      .query(fetchPartnerPayout);

    // Calculate total partner amount
    const totalPartnerAmount = partnerPayOutResult.reduce((total, partner) => {
      const payableAmount = partner.payableAmount;
      return total + payableAmount;
    }, 0);

    // my team table (bmm, franchise, member)
    const fetchMyTeam = "SELECT * FROM my_team";
    const [myTeamResult] = await connection.promise().query(fetchMyTeam);

    // Initialize totals for each user type with 0
    let totalAmountByUserType = {
      PARTNER: 0,
      FRANCHISE: 0,
      BMM: 0,
      MEMBER: 0,
    };

    // Update totals based on entries in my_team table
    myTeamResult.forEach((myTeam) => {
      const userType = myTeam.userType.toUpperCase();
      totalAmountByUserType[userType] += myTeam.amount;
    });

    // Calculate monthly wise amounts in partner table
    const monthlyWisePartnerAmount = partnerPayOutResult.reduce(
      (monthlyAmounts, partner) => {
        const payoutDate = moment(partner.payoutDate).format("YYYY-M");
        monthlyAmounts[payoutDate] =
          (monthlyAmounts[payoutDate] || 0) + partner.payableAmount;
        return monthlyAmounts;
      },
      {}
    );

    // Calculate monthly wise amounts in my_team (bmm, franchise, and member)
    // Calculate monthly wise amounts in my_team (bmm, franchise, and member)
    const monthlyWiseMyTeamAmount = myTeamResult.reduce(
      (monthlyAmounts, myTeam) => {
        const payoutDate = moment(myTeam.credit_date).format("YYYY-M");
        monthlyAmounts[payoutDate] =
          (monthlyAmounts[payoutDate] || 0) + myTeam.amount;
        return monthlyAmounts;
      },
      {}
    );

    // Combine monthly amounts from both tables for the same month and year
    const combinedMonthlyAmounts = {};

    // Get all unique keys from both monthlyWisePartnerAmount and monthlyWiseMyTeamAmount
    const allKeys = new Set([
      ...Object.keys(monthlyWisePartnerAmount),
      ...Object.keys(monthlyWiseMyTeamAmount),
    ]);

    // Combine data for each unique key
    allKeys.forEach((monthYear) => {
      const partnerAmount = monthlyWisePartnerAmount[monthYear] || 0;
      const myTeamAmount = monthlyWiseMyTeamAmount[monthYear] || 0;

      combinedMonthlyAmounts[monthYear] = {
        totalAmount: partnerAmount + myTeamAmount,
        partnerAmount,
        myTeamAmount,
        userTypeAmounts: {
          BMM:
            myTeamResult
              .filter(
                (item) =>
                  item.userType.toUpperCase() === "BMM" &&
                  moment(item.credit_date).format("YYYY-M") === monthYear
              )
              .reduce((total, item) => total + item.amount, 0) || 0,
          FRANCHISE:
            myTeamResult
              .filter(
                (item) =>
                  item.userType.toUpperCase() === "FRANCHISE" &&
                  moment(item.credit_date).format("YYYY-M") === monthYear
              )
              .reduce((total, item) => total + item.amount, 0) || 0,
          MEMBER:
            myTeamResult
              .filter(
                (item) =>
                  item.userType.toUpperCase() === "MEMBER" &&
                  moment(item.credit_date).format("YYYY-M") === monthYear
              )
              .reduce((total, item) => total + item.amount, 0) || 0,
          PARTNER:
            myTeamResult
              .filter(
                (item) =>
                  item.userType.toUpperCase() === "PARTNER" &&
                  moment(item.credit_date).format("YYYY-M") === monthYear
              )
              .reduce((total, item) => total + item.amount, 0) || 0,
        },
      };
    });

    const totalAmount =
      totalPartnerAmount +
      totalAmountByUserType.PARTNER +
      totalAmountByUserType.MEMBER +
      totalAmountByUserType.FRANCHISE +
      totalAmountByUserType.BMM;

    return res.status(200).json({
      message: "fetched filter payout",
      totalAmount,
      totalPartnerAmount,
      totalAmountByUserType,
      combinedMonthlyAmounts,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyBank = async (req, res) => {
  const { id } = req.params;
  try {
    const updateBankVerifyStatus = await connection
      .promise()
      .query("UPDATE bank_details SET isVerify = true WHERE id = ?", [id]);

    // Check if any rows were affected
    if (updateBankVerifyStatus[0].affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Bank verification updated successfully" });
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fetchAllVerifedAndUnverifiedBank = async (req, res) => {
  try {
    const [bankList] = await connection
      .promise()
      .query("SELECT * FROM bank_details");

    const verifiedBankList = bankList.filter((bank) => bank.isVerify === 1);
    const unverifiedBankList = bankList.filter((bank) => bank.isVerify === 0);

    const combinedBankList = {
      verified: verifiedBankList,
      unverified: unverifiedBankList,
    };

    return res.status(200).json({
      message: "fetched verified and unverified bank list",
      data: combinedBankList,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error", data: [] });
  }
};

//fetch last 3 each month target if target is available
exports.fetchBmmLastThreeMonthsTarget = async (req, res) => {
  try {
    const { referralId } = req.body;

    console.log(referralId, "referral id");

    const franchiseQuery =
      "SELECT * FROM create_franchise WHERE referredId = ?";
    const [franchiseRows] = await connection
      .promise()
      .query(franchiseQuery, [referralId]);

    const franchiseReferredIds = franchiseRows.map((entry) => entry.referralId);

    console.log(franchiseReferredIds, "franchise referralIds");
    let memberReferredIds = [];

    if (franchiseReferredIds.length > 0) {
      console.log("prasant");
      const memberQuery = "SELECT * FROM create_member WHERE m_refferid IN (?)";
      const [memberRows] = await connection
        .promise()
        .query(memberQuery, [franchiseReferredIds]);

      memberReferredIds = memberRows.map((member) => member.reffer_id);

      console.log(memberReferredIds, "member referralids");
    }

    let partnerRows = [];

    if (referralId && referralId.length > 0) {
      console.log("first condition");
      const partnerQuery =
        "SELECT * FROM mining_partner WHERE p_reffered_id IN (?)";
      const [result] = await connection
        .promise()
        .query(partnerQuery, [referralId]);
      partnerRows = partnerRows.concat(result);
    }

    if (franchiseReferredIds.length > 0) {
      console.log("2nd condition");
      const partnerQuery =
        "SELECT * FROM mining_partner WHERE p_reffered_id IN (?)";
      const [result] = await connection
        .promise()
        .query(partnerQuery, [franchiseReferredIds]);
      partnerRows = partnerRows.concat(result);
    }

    if (memberReferredIds.length > 0) {
      console.log("third condition");
      const partnerQuery =
        "SELECT * FROM mining_partner WHERE p_reffered_id IN (?)";
      const [result] = await connection
        .promise()
        .query(partnerQuery, [memberReferredIds]);
      partnerRows = partnerRows.concat(result);
    }

    // console.log(partnerRows, "partner list");

    const currentDate = new Date();

    const lastThreeMonthsLiquidity = {
      lastMonth: 0,
      secondLastMonth: 0,
      thirdLastMonth: 0,
    };
    let oneMonthBeforeDate = new Date(currentDate);
    oneMonthBeforeDate.setMonth(currentDate.getMonth() - 1);

    console.log(oneMonthBeforeDate);

    let secondMonthBeforeDate = new Date(currentDate);
    secondMonthBeforeDate.setMonth(currentDate.getMonth() - 2);

    let thirdMonthBeforeDate = new Date(currentDate);
    thirdMonthBeforeDate.setMonth(currentDate.getMonth() - 3);

    partnerRows.forEach((partner) => {
      // Check if verifyDate is a valid date
      if (partner.verifyDate instanceof Date && !isNaN(partner.verifyDate)) {
        const verifyDate = partner.verifyDate;

        if (
          verifyDate >= thirdMonthBeforeDate &&
          verifyDate < secondMonthBeforeDate
        ) {
          lastThreeMonthsLiquidity.thirdLastMonth += partner.p_liquidity;
        } else if (
          verifyDate >= secondMonthBeforeDate &&
          verifyDate < oneMonthBeforeDate
        ) {
          lastThreeMonthsLiquidity.secondLastMonth += partner.p_liquidity;
        } else if (
          verifyDate >= oneMonthBeforeDate &&
          verifyDate <= currentDate
        ) {
          lastThreeMonthsLiquidity.lastMonth += partner.p_liquidity;
        }
      }
    });

    if (partnerRows.length === 0) {
      return res
        .status(200)
        .json({ message: "No partners found for the given referralId" });
    }

    return res.status(200).json({
      message: "Partners fetched successfully",
      lastThreeMonthsLiquidity,
    });
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//downgrade bmm to member
exports.downgradeBmm = async (req, res) => {
  try {
    const { userId } = req.body;

    const fetchBMMQuery = "SELECT * FROM create_sho WHERE stateHandlerId = ?";
    const [result] = await connection.promise().query(fetchBMMQuery, [userId]);

    if (result.length > 0) {
      const {
        fname,
        lname,
        phone,
        referredId,
        referralId,
        selectedState,
        email,
        gender,
        stateHandlerId: userid,
        password,
        stateHandlerWallet: wallet,
        isVerify,
        verifyDate,
        isBlocked,
        adhar_front_side,
        adhar_back_side,
        panCard,
        priority,
      } = result[0];

      if (!verifyDate) {
        return res.status(400).json({ message: "This BMM is not verified" });
      }

      if (priority === 1) {
        console.log("first");
        const checkIfBmmIsMemberBefore =
          "SELECT * FROM create_member WHERE m_userid = ?";
        const [memberResult] = await connection
          .promise()
          .query(checkIfBmmIsMemberBefore, [userid]);

        if (memberResult.length === 0) {
          console.log("first first");

          const downgradeBmmToMember =
            "INSERT INTO create_member(m_name, m_lname, m_phone, m_refferid, m_state, m_email, m_gender, m_userid, m_password, reffer_id, member_wallet, isVerify, isBlocked, adhar_front_side, adhar_back_side, panCard, priority, target, userType, verifyDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          await connection.promise().query(downgradeBmmToMember, [
            fname,
            lname,
            phone,
            "FC-FRA9112",
            selectedState,
            email,
            gender,
            userid,
            password,
            referralId,
            wallet,
            0, //unverified
            isBlocked,
            adhar_front_side,
            adhar_back_side,
            panCard,
            1, // priority for member
            0, // target for member
            "MEMBER", // userType for member
            verifyDate,
          ]);

          const updateBmmTable =
            "UPDATE create_sho SET priority = 0, stateHandlerWallet = 0, target = 0, isVerify = 0 WHERE stateHandlerId = ?";
          await connection.promise().query(updateBmmTable, [userid]);

          return res.status(200).json({
            message: "BMM manually downgraded to member successfully",
          });
        } else {
          updateMember = await connection
            .promise()
            .query("update create_member set priority=1 where m_userid = ?", [
              userId,
            ]);
          const updateBmmTable =
            "UPDATE create_sho SET priority = 0, stateHandlerWallet = 0, target = 0, isVerify = 0 WHERE stateHandlerId = ?";
          await connection.promise().query(updateBmmTable, [userid]);

          return res.status(200).json({
            message: "BMM manually downgraded to member successfully",
          });
        }
      } else {
        console.log("secomd");
        return res.status(400).json({ message: "User is not a BMM" });
      }
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in try-catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.fetchFranchiseLastThreeMonthsTarget = async (req, res) => {
  try {
    const { referralId } = req.body;

    console.log(referralId, "referral id");

    const memberQuery = "SELECT * FROM create_member WHERE m_refferid IN (?)";
    const [memberRows] = await connection
      .promise()
      .query(memberQuery, [referralId]);

    const memberReferredIds = memberRows.map((member) => member.reffer_id);

    console.log(memberReferredIds, "member referralids");

    let partnerRows = [];

    if (referralId && referralId.length > 0) {
      console.log("first condition");
      const partnerQuery =
        "SELECT * FROM mining_partner WHERE p_reffered_id IN (?)";
      const [result] = await connection
        .promise()
        .query(partnerQuery, [referralId]);
      partnerRows = partnerRows.concat(result);
    }

    if (memberReferredIds.length > 0) {
      console.log("second condition");
      const partnerQuery =
        "SELECT * FROM mining_partner WHERE p_reffered_id IN (?)";
      const [result] = await connection
        .promise()
        .query(partnerQuery, [memberReferredIds]);
      partnerRows = partnerRows.concat(result);
    }

    if (partnerRows.length === 0) {
      return res
        .status(200)
        .json({ message: "No partners found for the given referralId" });
    }
    // console.log(partnerRows, "partner list");

    const currentDate = new Date();

    const lastThreeMonthsLiquidity = {
      lastMonth: 0,
      secondLastMonth: 0,
      thirdLastMonth: 0,
    };
    let oneMonthBeforeDate = new Date(currentDate);
    oneMonthBeforeDate.setMonth(currentDate.getMonth() - 1);

    console.log(oneMonthBeforeDate);

    let secondMonthBeforeDate = new Date(currentDate);
    secondMonthBeforeDate.setMonth(currentDate.getMonth() - 2);

    let thirdMonthBeforeDate = new Date(currentDate);
    thirdMonthBeforeDate.setMonth(currentDate.getMonth() - 3);

    partnerRows.forEach((partner) => {
      // Check if verifyDate is a valid date
      if (partner.verifyDate instanceof Date && !isNaN(partner.verifyDate)) {
        const verifyDate = partner.verifyDate;

        if (
          verifyDate >= thirdMonthBeforeDate &&
          verifyDate < secondMonthBeforeDate
        ) {
          lastThreeMonthsLiquidity.thirdLastMonth += partner.p_liquidity;
        } else if (
          verifyDate >= secondMonthBeforeDate &&
          verifyDate < oneMonthBeforeDate
        ) {
          lastThreeMonthsLiquidity.secondLastMonth += partner.p_liquidity;
        } else if (
          verifyDate >= oneMonthBeforeDate &&
          verifyDate <= currentDate
        ) {
          lastThreeMonthsLiquidity.lastMonth += partner.p_liquidity;
        }
      }
    });

    if (partnerRows.length === 0) {
      return res
        .status(200)
        .json({ message: "No partners found for the given referralId" });
    }

    return res.status(200).json({
      message: "Last three month achieved target fetched successfully",
      lastThreeMonthsLiquidity,
    });
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// downgrade franchise to member
exports.downgradeFranchise = async (req, res) => {
  try {
    const { userId } = req.body;

    const fetchFranchiseQuery =
      "SELECT * FROM create_franchise WHERE franchiseId = ?";
    const [result] = await connection
      .promise()
      .query(fetchFranchiseQuery, [userId]);

    if (result.length > 0) {
      const {
        fname,
        lname,
        phone,
        referralId,
        referredId,
        franchiseState: state,
        email,
        gender,
        franchiseId: userid,
        password,
        franchiseWallet: wallet,
        isVerify,
        isBlocked,
        adhar_front_side: aadharFront,
        adhar_back_side: aadharBack,
        panCard,
        m_dob: dob,
        priority,
        userType,
        target,
        verifyDate,
      } = result[0];

      if (!verifyDate) {
        return res
          .status(400)
          .json({ message: "This franchise is not verified" });
      }

      if (priority === 1) {
        const checkIfFranchiseIsMemberBefore =
          "SELECT * FROM create_member WHERE m_userid = ?";
        const [memberResult] = await connection
          .promise()
          .query(checkIfFranchiseIsMemberBefore, [userId]);

        if (memberResult.length === 0) {
          const downgradeFranchiseToMember =
            "INSERT INTO create_member(m_name, m_lname, m_phone, m_refferid, m_state, m_email, m_gender, m_userid, m_password, reffer_id, member_wallet, isVerify, isBlocked, adhar_front_side, adhar_back_side, panCard, priority, target, userType, verifyDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          await connection.promise().query(downgradeFranchiseToMember, [
            fname,
            lname,
            phone,
            referredId,
            state,
            email,
            gender,
            userid,
            password,
            referralId,
            wallet,
            0, //verify
            isBlocked,
            aadharFront,
            aadharBack,
            panCard,
            1, // priority for member
            0, // target for member
            "FRANCHISE", // userType for member
            verifyDate,
          ]);

          const updateFranchiseTable =
            "UPDATE create_franchise SET priority = 0, franchiseWallet = 0, target = 0, isVerify = 0 WHERE franchiseId = ?";
          await connection.promise().query(updateFranchiseTable, [userId]);

          return res.status(200).json({
            message: "Franchise manually downgraded to member successfully",
          });
        } else {
          await connection
            .promise()
            .query("update create_member set priority = 1 where m_userid = ?", [
              userId,
            ]);

          const updateFranchiseTable =
            "UPDATE create_franchise SET priority = 0, franchiseWallet = 0, target = 0, isVerify = 0 WHERE franchiseId = ?";
          await connection.promise().query(updateFranchiseTable, [userId]);

          return res.status(200).json({
            message: "Franchise manually downgraded to member successfully",
          });
        }
      } else {
        return res.status(400).json({ message: "User is not a Franchise" });
      }
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in try-catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Upgrade franchise to BMM
exports.upgradeFranchiseToBMM = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch franchise data
    const fetchFranchiseQuery =
      "SELECT * FROM create_franchise WHERE franchiseId = ?";
    const [franchiseResult] = await connection
      .promise()
      .query(fetchFranchiseQuery, [userId]);

    if (franchiseResult.length > 0) {
      const {
        fname,
        lname,
        phone,
        referralId,
        referredId,
        franchiseState: state,
        email,
        gender,
        franchiseId: userid,
        password,
        franchiseWallet: wallet,
        isVerify,
        isBlocked,
        adhar_front_side: aadharFront,
        adhar_back_side: aadharBack,
        panCard,
        m_dob: dob,
        priority,
        userType,
        target,
        verifyDate,
      } = franchiseResult[0];

      if (!verifyDate) {
        return res
          .status(400)
          .json({ message: "This franchise is not verified" });
      }

      // Check if the member is not already a BMM

      const [existingBMMResult] = await connection
        .promise()
        .query("select * from create_sho where stateHandlerId =?", userId);

      if (existingBMMResult.length > 0) {
        //delete bmm
        await connection
          .promise()
          .query("DELETE FROM create_sho WHERE stateHandlerId = ?", userId);
      }

      // Check if the franchise is not already a BMM
      // Insert data into create_sho table
      const upgradeFranchiseToBMM =
        "INSERT INTO create_sho(fname, lname, phone, referralId, referredId, selectedState, email, gender, stateHandlerId, password, stateHandlerWallet, isVerify, verifyDate, isBlocked, adhar_front_side, adhar_back_side, panCard, priority, target, userType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      await connection.promise().query(upgradeFranchiseToBMM, [
        fname,
        lname,
        phone,
        referralId,
        "admin123",
        state,
        email,
        gender,
        userid,
        password,
        wallet,
        0,
        verifyDate,
        isBlocked,
        aadharFront,
        aadharBack,
        panCard,
        1,
        target,
        "BMM", // Set userType as BMM
      ]);

      // Update franchise table after upgrade
      const updateFranchiseTable =
        "UPDATE create_franchise SET franchiseWallet=0,isVerify =0,priority=0 WHERE franchiseId = ?";
      await connection.promise().query(updateFranchiseTable, [userid]);

      return res
        .status(200)
        .json({ message: "Franchise upgraded to BMM successfully" });
    } else {
      return res.status(400).json({ message: "Franchise not found" });
    }
  } catch (error) {
    console.error("Error in try-catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//fetch last 3 month for member target

exports.fetchMemberLastThreeMonthsTarget = async (req, res) => {
  try {
    const { referralId } = req.body;

    console.log(referralId, "referral id");

    let partnerRows = [];

    if (referralId) {
      console.log("first condition");
      const partnerQuery =
        "SELECT * FROM mining_partner WHERE p_reffered_id IN (?)";
      const [result] = await connection
        .promise()
        .query(partnerQuery, [referralId]);
      partnerRows = partnerRows.concat(result);
    }

    if (partnerRows.length === 0) {
      return res
        .status(200)
        .json({ message: "No partners found for the given referralId" });
    }
    // console.log(partnerRows, "partner list");

    const currentDate = new Date();

    const lastThreeMonthsLiquidity = {
      lastMonth: 0,
      secondLastMonth: 0,
      thirdLastMonth: 0,
    };
    let oneMonthBeforeDate = new Date(currentDate);
    oneMonthBeforeDate.setMonth(currentDate.getMonth() - 1);

    console.log(oneMonthBeforeDate);

    let secondMonthBeforeDate = new Date(currentDate);
    secondMonthBeforeDate.setMonth(currentDate.getMonth() - 2);

    let thirdMonthBeforeDate = new Date(currentDate);
    thirdMonthBeforeDate.setMonth(currentDate.getMonth() - 3);

    partnerRows.forEach((partner) => {
      // Check if verifyDate is a valid date
      if (partner.verifyDate instanceof Date && !isNaN(partner.verifyDate)) {
        const verifyDate = partner.verifyDate;

        if (
          verifyDate >= thirdMonthBeforeDate &&
          verifyDate < secondMonthBeforeDate
        ) {
          lastThreeMonthsLiquidity.thirdLastMonth += partner.p_liquidity;
        } else if (
          verifyDate >= secondMonthBeforeDate &&
          verifyDate < oneMonthBeforeDate
        ) {
          lastThreeMonthsLiquidity.secondLastMonth += partner.p_liquidity;
        } else if (
          verifyDate >= oneMonthBeforeDate &&
          verifyDate <= currentDate
        ) {
          lastThreeMonthsLiquidity.lastMonth += partner.p_liquidity;
        }
      }
    });

    if (partnerRows.length === 0) {
      return res
        .status(200)
        .json({ message: "No partners found for the given referralId" });
    }

    return res.status(200).json({
      message: "Last three month achieved target fetched successfully",
      lastThreeMonthsLiquidity,
    });
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Upgrade member to franchise
exports.upgradeMemberToFranchise = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch member data
    const fetchMemberQuery = "SELECT * FROM create_member WHERE m_userid = ?";
    const [memberResult] = await connection
      .promise()
      .query(fetchMemberQuery, [userId]);

    if (memberResult.length > 0) {
      const {
        m_name: fname,
        m_lname: lname,
        m_phone: phone,
        m_refferid,
        m_state: selectedState,
        m_email: email,
        m_gender: gender,
        m_userid: userid,
        m_password: password,
        member_wallet: wallet,
        isVerify,
        isBlocked,
        adhar_front_side,
        adhar_back_side,
        panCard,
        priority,
        target,
        userType,
        verifyDate,
        m_add,
        reffer_id,
      } = memberResult[0];

      if (!verifyDate) {
        return res
          .status(400)
          .json({ message: "This referral is not verified" });
      }

      // Check if the member is not already a BMM

      const [existingFranchiseResult] = await connection
        .promise()
        .query("select * from create_franchise where franchiseId =?", userId);

      if (existingFranchiseResult.length > 0) {
        //delete fanchise
        await connection
          .promise()
          .query("DELETE FROM create_franchise WHERE franchiseId = ?", userId);
      }

      //franchise fetch

      const [franchiseResult] = await connection
        .promise()
        .query("select * from create_franchise where referralId  = ?", [
          m_refferid,
        ]);

      const frachiseReferredId = franchiseResult[0].referredId;

      // Insert data into create_franchise table
      const insertFranchiseQuery =
        "INSERT INTO create_franchise(fname, lname, phone, referralId, referredId, franchiseState, email, gender, franchiseId, password, franchiseWallet, isVerify, verifyDate, isBlocked, adhar_front_side, adhar_back_side, panCard, priority, target, userType,franchiseCity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      await connection.promise().query(insertFranchiseQuery, [
        fname,
        lname,
        phone,
        reffer_id,
        frachiseReferredId,
        selectedState,
        email,
        gender,
        userid,
        password,
        wallet,
        0,
        verifyDate,
        0,
        adhar_front_side,
        adhar_back_side,
        panCard,
        1,
        0,
        "FRANCHISE", // Set userType as MEMBER
        m_add,
      ]);

      // Update member table after upgrade
      const updateMemberTable =
        "UPDATE create_member SET member_wallet =0,priority =0, isVerify = 0 WHERE m_userid = ?";
      await connection.promise().query(updateMemberTable, [userid]);

      return res
        .status(200)
        .json({ message: "Member upgraded to franchise successfully" });
    } else {
      return res.status(400).json({ message: "Member not found" });
    }
  } catch (error) {
    console.error("Error in try-catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.findPhoneByLastThreeDigitRigId = async (req, res) => {
  try {
    const { rigId } = req.body;
    const lastThreeDigitRigId = rigId.slice(-3);

    const [phoneNumberResult] = await connection
      .promise()
      .query(
        "SELECT p_phone,p_state, rigId FROM mining_partner WHERE rigId LIKE ?",
        [`%${lastThreeDigitRigId}`]
      );

    if (phoneNumberResult.length > 0) {
      const phoneNumber = phoneNumberResult[0].p_phone;
      const state = phoneNumberResult[0].p_state;

      res.status(200).json({ phoneNumber, state });
    } else {
      res.status(404).json({
        message:
          "Phone number not found for the provided rigId's last three digits",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchNamesWithRigId = async (req, res) => {
  try {
    const { rigIds } = req.body;
    console.log(rigIds, 6098);

    if (rigIds.length === 0) {
      return res.status(404).json({ message: "Data not availbale." });
    }

    // Initialize an array to store the combined result
    let combinedResult = [];

    // Query the first database table to fetch rows that match
    const [rows1] = await connection
      .promise()
      .query(
        `SELECT rigId, p_name, p_lname FROM mining_partner WHERE rigId IN (?)`,
        [rigIds]
      );

    // Push results from the first query into the combined result
    rows1.forEach((row) => {
      rigIds.forEach((id) => {
        if (row.rigId === id) {
          combinedResult.push({
            rigId: row.rigId,
            name: `${row.p_name} ${row.p_lname}`,
          });
        }
      });
    });

    // Query the second database table to fetch rows that match
    const [rows2] = await connection
      .promise()
      .query(
        `SELECT rigId, fname, lname FROM multiple_rig_partner WHERE rigId IN (?)`,
        [rigIds]
      );

    // Push results from the second query into the combined result
    rows2.forEach((row) => {
      rigIds.forEach((id) => {
        if (row.rigId === id) {
          combinedResult.push({
            rigId: row.rigId,
            name: `${row.fname} ${row.lname}`,
          });
        }
      });
    });

    // Send the combined result as a response
    res.status(200).json({
      message: "All names fetched successfully",
      data: combinedResult,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchAllPartnerPayoutCount = async (req, res) => {
  try {
    const { rigId } = req.body;
    if (!rigId || rigId.length === 0) {
      return res.status(400).json({ message: "Rig IDs are required." });
    }

    const queryString = "SELECT * FROM partner_payout WHERE rigId IN (?)";
    const [partnerPayouts] = await connection
      .promise()
      .query(queryString, [rigId]);

    let maxPayableCounts = [];

    // Initialize max payable counts for each rigId
    rigId.forEach((id) => {
      maxPayableCounts.push({ rigId: id, maxPayableCount: 0 });
    });

    // Find max payable count for each rigId
    partnerPayouts.forEach((payout) => {
      const index = maxPayableCounts.findIndex(
        (item) => item.rigId === payout.rigId
      );
      if (
        index !== -1 &&
        payout.payableCount > maxPayableCounts[index].maxPayableCount
      ) {
        maxPayableCounts[index].maxPayableCount = payout.payableCount;
      }
    });

    return res.status(200).json({
      message: "Partner payouts fetched successfully",
      maxPayableCounts: maxPayableCounts,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// partnersRigInsideReferralInAdmin
exports.partnersRigInsideReferralInAdmin = async (req, res) => {
  try {
    const { referralId } = req.body;

    if (!referralId) {
      return res.status(400).json({ message: "Referral ID is required" });
    }

    // Step 1: Fetch all records from mining_partner where p_referred_id matches the given referralId
    const queryString1 = "SELECT * FROM mining_partner WHERE p_reffered_id = ?";
    const [partners] = await connection
      .promise()
      .query(queryString1, [referralId]);

    if (partners.length === 0) {
      return res
        .status(404)
        .json({ message: "No partners found for the provided referral ID" });
    }

    // Extract partner user ids using map
    const partnerUserIds = partners.map((partner) => partner.p_userid);

    // Step 2: Find multiple rig partners based on the partner user ids
    const queryString2 =
      "SELECT * FROM multiple_rig_partner WHERE userId IN (?)";
    const [multiplePartners] = await connection
      .promise()
      .query(queryString2, [partnerUserIds]);

    // Return the results
    res.json({
      message: "Data retrieved successfully",
      partners,
      multiplePartners,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// adminFetchLiquidityDetailsForActivePartners
exports.adminFetchLiquidityDetailsForActivePartners = async (req, res) => {
  try {
    const { userid } = req.body;
    
    if (!userid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch data from mining_partner table
    const miningPartnerQuery = "SELECT * FROM mining_partner WHERE p_userid = ?";
    const [miningPartnerResults] = await connection.promise().query(miningPartnerQuery, [userid]);

    // Fetch data from multiple_rig_partner table
    const multipleRigPartnerQuery = "SELECT * FROM multiple_rig_partner WHERE userId = ?";
    const [multipleRigPartnerResults] = await connection.promise().query(multipleRigPartnerQuery, [userid]);

    // Concatenate the results into a single array
    const combinedResults = miningPartnerResults.concat(multipleRigPartnerResults);

    return res.status(200).json({
      message: "Liquidity details for active partners fetched successfully",
      combined_data: combinedResults
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.createReferralWallet = async (req, res) => {
  try {
    const { name, userId, rigId, liquidity, doj, amount, referralId , dateOfPayment} = req.body;

    if (!name || !userId || !rigId || !liquidity || !doj || !amount || !referralId ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Insert data into the referral_wallet table
    const createReferralWalletQuery = `
      INSERT INTO referral_wallet (name, userId, rigId, liquidity, doj, amount, referralId, dateOfPayment)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [insertResult] = await connection.promise().query(createReferralWalletQuery, [
      name,
      userId,
      rigId,
      liquidity,
      doj,
      amount,
      referralId, 
      dateOfPayment
    ]);

    // Check if the insertion was successful
    if (insertResult.affectedRows === 1) {
      return res.status(200).json({ message: "Referral wallet created successfully" });
    } else {
      return res.status(500).json({ message: "Failed to create referral wallet" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.fetchReferralWalletWithRigId = async (req, res) => {
  try {
    const { rigId } = req.params;

    const query = "SELECT * FROM referral_wallet WHERE rigId = ?";
    
    // Execute the query asynchronously
    const [results] = await connection.promise().query(query, [rigId]);

    // Send the results as JSON response
    return res.status(200).json({message: "fetched referral wallet successfully.", data:results});

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


