const jwt = require("jsonwebtoken");
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
        console.log(p_refferal_id, "123");
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
  //const partnerId = req.body;
  let query =
    "select p_userid,p_name,p_lname,p_phone,p_reffered_id,p_dop,p_liquidity,partner_status,month_count from mining_partner where (partner_status = '1' OR month_count='11') OR (partner_status = '0' AND month_count = '12')";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched All Active Partner Only successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
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
  console.log(partnerId.p_userid, "250");
  let query =
    "select partner_wallet,request_date,p_userid from partner_withdrawal where id = ? ";
  connection.query(query, [partnerId.id], (err, results) => {
    if (!err) {
      //console.log(res);
      console.log(results);

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
                  console.log(partnerPhone, "270");
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

            console.log("292");
            let deletequery = "delete from partner_withdrawal where id = ?";
            connection.query(deletequery, [partnerId.id], (err, results) => {
              if (!err) {
                console.log("297");
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
  //const partnerId = req.body;
  let query =
    "select  m_userid,member_wallet,request_date,id from member_withdrawal ";
  connection.query(query, (err, results) => {
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
  // console.log(memberid.m_userid);
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
  // console.log(memberid.m_userid);
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
    "update mining_partner set p_name=?, p_aadhar=?,p_phone=?,p_email=?,p_address=?,p_state=?,p_nominee_name=?,p_nominee_aadhar=?,p_nominee_phone=?,p_dob=?,p_dop=?,p_liquidity=? where p_userid=? ";
  connection.query(
    query,
    [
      partnerId.p_name,
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
  console.log(memberId.id, "480");
  let query =
    "select member_wallet,request_date from member_withdrawal where id = ? ";
  connection.query(query, [memberId.id], (err, results) => {
    if (!err) {
      //
      let member_wallet = results[0]?.member_wallet;
      let request_date = results[0]?.request_date;
      let approve_date = new Date();
      console.log("hiii 427");
      let insertquery =
        "insert into member_withdrawal_history (member_wallet,request_date,approve_date,m_userid) values (?,?,?,?)";
      connection.query(
        insertquery,
        [member_wallet, request_date, approve_date, memberId.m_userid],
        (err, results) => {
          // console.log('hii 427');
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
                      console.log(memberEmail, "437");
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
        // console.log(approve_date);
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

// doActivatePartnerManualFromAdmin
exports.doActivatePartnerManualFromAdmin = (req, res) => {

  let partnerid = req.body;
  if (!partnerid) {
    return res.status(422).json({
      message: "No Data Found",
    });
  }
  let query = "update mining_partner set partner_status = ? where p_userid = ? ";
  connection.query(
    query,
    [(partner_status = 1), partnerid.p_userid],
    (err, results) => {
      if (!err) {
        let selectquery =
          " select * from mining_partner where p_userid = ?";
        connection.query(selectquery, [partnerid.p_userid], (err, results) => {
          console.log(results, "results")

          let liquidity = results[0]?.p_liquidity;
          let phone = results[0]?.p_phone;
          console.log(liquidity, phone, "621");
          doPartnerActivateSms(phone, { liquidity: liquidity });


          const findMember =  "Select * from create_member where reffer_id = ?"

          connection.query(findMember, [results[0].p_reffered_id], (error, result) => {
            if(error){
              console.log((error.message))
            }
          })


        });



        return res.status(200).json({
          message: "Mining Partner Liquiditity Paid successfully",
        });
      } else {
        return res.status(500).json({
          message: err,
        });
      }
    }
  );
};

// perdayAmountTransferToPartnerManual
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
                          return res.status(400).json({
                            message: "Your Plan has been expired ",
                          });
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

                // if (partner_count === 30 || partner_count > 30) {

                //     let insertquery = "insert into partner_withdrawal (partner_wallet,request_date,p_userid) values (?,?,?)";
                //     connection.query(insertquery, [partner_wallet, request_date, partnerid.p_userid], (err, results) => {

                //         if (!err) {

                //             month_count = month_count + 1;
                //             let updatequery = "update mining_partner set partner_wallet =?, partner_count=?,month_count=? where p_userid = ?";

                //             connection.query(updatequery, [partner_wallet = 0, partner_count = 0, month_count, partnerid.p_userid], (err, results) => {

                //                 try {
                //                     if (!err) {
                //                         // return res.status(200).json({
                //                         //     message: "Mining Partner Set Zero "
                //                         // })
                //                         let selectquery = "select * from partner_reffer_wallet where reffer_p_userid = ?";
                //                         connection.query(selectquery,[partnerid.p_userid],(err,results) =>{

                //                             if(!err){
                //                                 let p_userid = results[0]?.p_userid;
                //                                 let partner_wallet = results[0]?.partner_wallet;
                //                                 //console.log(partner_wallet,'1208');
                //                                 let reffer_p_userid = results[0]?.reffer_p_userid;

                //                                 let insertquery = "insert into partner_reffer_withdrawal (partner_wallet,request_date,reffer_p_userid,p_userid) values(?,?,?,?)";
                //                                 connection.query(insertquery,[partner_wallet,request_date,reffer_p_userid,p_userid],(err,results) =>{
                //                                     if(!err){
                //                                         console.log('953');
                //                                     }
                //                                 })
                //                             }
                //                         })

                //                     } else {
                //                         return res.status(404).json({
                //                             message: "Something Went Wrong 1"
                //                         })
                //                     }
                //                 } catch (error) {

                //                     return error;
                //                 }
                //             })

                //             console.log(table_flag);
                //         } else {

                //             return res.status(500).json({
                //                 message: "Internal Server Error"
                //             })
                //         }
                //     })

                // } /// 30 days condition

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
                          console.log(partner_wallet, "811");
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

                                  //let formatdate = partnerid.partnerdate.toLocaleString("en-US",{timeZone:"Asia/Kolkata"});
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
                                                          if (
                                                            table_flag ===
                                                            "mining_partner"
                                                          ) {
                                                            let refferquery =
                                                              "select p_reffered_id from mining_partner where p_userid = ?";
                                                            connection.query(
                                                              refferquery,
                                                              [
                                                                partnerid.p_userid,
                                                              ],
                                                              (
                                                                err,
                                                                results
                                                              ) => {
                                                                try {
                                                                  console.log(
                                                                    results[0]
                                                                      .p_reffered_id
                                                                  );
                                                                  reffered_id =
                                                                    results[0]
                                                                      .p_reffered_id;
                                                                  reffer_p_userid =
                                                                    partnerid.p_userid;
                                                                  //console.log(reffer_p_userid);
                                                                  if (!err) {
                                                                    let query =
                                                                      "select p_userid,partner_wallet,partner_count from mining_partner where p_refferal_id = ?";
                                                                    connection.query(
                                                                      query,
                                                                      [
                                                                        reffered_id,
                                                                      ],
                                                                      (
                                                                        err,
                                                                        results
                                                                      ) => {
                                                                        let partner_wallet =
                                                                          results[0]
                                                                            .partner_wallet;
                                                                        let partner_count =
                                                                          results[0]
                                                                            .partner_count;
                                                                        let p_userid =
                                                                          results[0]
                                                                            .p_userid;
                                                                        let walletAmount =
                                                                          partnerid.refferal_Amount;
                                                                        //partner_count = partner_count + 1;
                                                                        //partner_wallet = partner_wallet + walletAmount;
                                                                        //console.log(partner_wallet);
                                                                        //let wallet_update_date = new Date();
                                                                        // if (partnerid.perDayAmounReal === 0) {
                                                                        //     partner_wallet = partner_wallet + 0;
                                                                        //     walletAmount = 0;
                                                                        // }
                                                                        // if (partnerid.perDayAmounReal != 0) {
                                                                        //     partner_wallet = partner_wallet + 375;
                                                                        //     walletAmount = 375;
                                                                        // }

                                                                        //let updatequery = "update mining_partner set partner_wallet=?,wallet_update_date=? where p_refferal_id =?"
                                                                        // connection.query(updatequery, [partner_wallet, partnerid.partnerdate, reffered_id], (err, results) => {

                                                                        // try {
                                                                        // if (!err) {
                                                                        // return res.status(200).json({
                                                                        //     message: "Mining Partner Updated Successfully"
                                                                        // })

                                                                        let insertquery =
                                                                          "insert into partner_reffer_wallet_history ( reffer_p_userid,wallet_amount,date,p_userid) values (?,?,?,?)";
                                                                        connection.query(
                                                                          insertquery,
                                                                          [
                                                                            reffer_p_userid,
                                                                            walletAmount,
                                                                            partnerid.partnerdate,
                                                                            p_userid,
                                                                          ],
                                                                          (
                                                                            err,
                                                                            results
                                                                          ) => {
                                                                            try {
                                                                              if (
                                                                                !err
                                                                              ) {
                                                                                console.log(
                                                                                  902
                                                                                );
                                                                                let insertRefferMonthlyPayout =
                                                                                  "insert into partner_reffer_withdrawal (reffer_p_userid,partner_wallet,request_date,p_userid) values(?,?,?,?)";
                                                                                connection.query(
                                                                                  insertRefferMonthlyPayout,
                                                                                  [
                                                                                    reffer_p_userid,
                                                                                    walletAmount,
                                                                                    partnerid.partnerdate,
                                                                                    p_userid,
                                                                                  ],
                                                                                  (
                                                                                    err,
                                                                                    results
                                                                                  ) => {
                                                                                    if (
                                                                                      !err
                                                                                    ) {
                                                                                    }
                                                                                  }
                                                                                );
                                                                                let selectquery =
                                                                                  "select * from partner_reffer_wallet where reffer_p_userid = ?";
                                                                                connection.query(
                                                                                  selectquery,
                                                                                  [
                                                                                    reffer_p_userid,
                                                                                  ],
                                                                                  (
                                                                                    err,
                                                                                    results
                                                                                  ) => {
                                                                                    let partner_wallet =
                                                                                      results[0]
                                                                                        ?.partner_wallet;

                                                                                    if (
                                                                                      partnerid.perDayAmounReal ===
                                                                                      0
                                                                                    ) {
                                                                                      partner_wallet =
                                                                                        partner_wallet +
                                                                                        0;
                                                                                      walletAmount = 0;
                                                                                    }
                                                                                    if (
                                                                                      partnerid.perDayAmounReal !=
                                                                                      0
                                                                                    ) {
                                                                                      partner_wallet =
                                                                                        partner_wallet +
                                                                                        partnerid.refferal_Amount;
                                                                                      walletAmount =
                                                                                        partnerid.refferal_Amount;
                                                                                    }

                                                                                    if (
                                                                                      results.length ===
                                                                                      0
                                                                                    ) {
                                                                                      let insertquery =
                                                                                        "insert into partner_reffer_wallet (reffer_p_userid,wallet_amount,date,p_userid,partner_wallet) values (?,?,?,?,?)";
                                                                                      connection.query(
                                                                                        insertquery,
                                                                                        [
                                                                                          reffer_p_userid,
                                                                                          walletAmount,
                                                                                          partnerid.partnerdate,
                                                                                          p_userid,
                                                                                          walletAmount,
                                                                                        ]
                                                                                      );
                                                                                    }
                                                                                    if (
                                                                                      results.length >
                                                                                      0
                                                                                    ) {
                                                                                      let updatequery =
                                                                                        "update partner_reffer_wallet set partner_wallet = ?, date = ? where reffer_p_userid = ?";
                                                                                      connection.query(
                                                                                        updatequery,
                                                                                        [
                                                                                          partner_wallet,
                                                                                          partnerid.partnerdate,
                                                                                          reffer_p_userid,
                                                                                        ],
                                                                                        (
                                                                                          err,
                                                                                          results
                                                                                        ) => {
                                                                                          if (
                                                                                            !err
                                                                                          ) {
                                                                                            console.log(
                                                                                              "898"
                                                                                            );
                                                                                          }
                                                                                        }
                                                                                      );
                                                                                    }
                                                                                  }
                                                                                );
                                                                              } else {
                                                                                return res
                                                                                  .status(
                                                                                    404
                                                                                  )
                                                                                  .json(
                                                                                    {
                                                                                      message:
                                                                                        "Something Went Wrong",
                                                                                    }
                                                                                  );
                                                                              }
                                                                            } catch (error) {
                                                                              return error;
                                                                            }
                                                                          }
                                                                        );

                                                                        //} else {
                                                                        //return res.status(404).json({
                                                                        // message: "Something Went Wrong"
                                                                        //})
                                                                        // }
                                                                        //} catch (error) {
                                                                        //return error;
                                                                        //}

                                                                        //});
                                                                        //  not use 30 days
                                                                        // if (partner_count === 30 || partner_count > 30) {

                                                                        //     let insertquery = "insert into partner_withdrawal (partner_wallet,request_date,p_userid) values (?,?,?)";
                                                                        //     connection.query(insertquery, [partner_wallet, request_date, p_userid], (err, results) => {

                                                                        //         try {
                                                                        //             if (!err) {
                                                                        //                 let updatequery = "update mining_partner set partner_wallet =?, partner_count=? where p_userid = ?";
                                                                        //                 connection.query(updatequery, [partner_wallet = 0, partner_count = 1, p_userid], (err, results) => {

                                                                        //                     try {
                                                                        //                         if (!err) {
                                                                        //                             // return res.status(200).json({
                                                                        //                             //     messgae: "Mining Partner Set To Zero"
                                                                        //                             // })
                                                                        //                             console.log('hiiii 941');
                                                                        //                             let selectquery = "select * from partner_reffer_wallet where reffer_p_userid = ?";
                                                                        //                             connection.query(selectquery,[partnerid.p_userid],(err,results) =>{

                                                                        //                                 if(!err){
                                                                        //                                     let p_userid = results[0]?.p_userid;
                                                                        //                                     let partner_wallet = results[0]?.partner_wallet;
                                                                        //                                     let reffer_p_userid = results[0]?.reffer_p_userid;

                                                                        //                                     let insertquery = "insert into partner_reffer_withdrawal (partner_wallet,request_date,reffer_p_userid,p_userid) values(?,?,?,?)";
                                                                        //                                     connection.query(insertquery,[partner_wallet,request_date,reffer_p_userid,p_userid],(err,results) =>{
                                                                        //                                         if(!err){
                                                                        //                                             console.log('953');
                                                                        //                                         }
                                                                        //                                     })
                                                                        //                                 }
                                                                        //                             })

                                                                        //                         } else {
                                                                        //                             return res.status(404).json({
                                                                        //                                 messgae: "Something Went Wrong"
                                                                        //                             })
                                                                        //                         }
                                                                        //                     } catch (error) {
                                                                        //                         return error;
                                                                        //                     }

                                                                        //                 });
                                                                        //             } else {
                                                                        //                 return res.status(404).json({
                                                                        //                     message: "Something Went Wrong"
                                                                        //                 })
                                                                        //             }

                                                                        //         } catch (error) {

                                                                        //             return error;
                                                                        //         }

                                                                        //     });
                                                                        // }
                                                                        // not use 30 days
                                                                      }
                                                                    );
                                                                  } else {
                                                                    return res
                                                                      .status(
                                                                        404
                                                                      )
                                                                      .json({
                                                                        message:
                                                                          "Something Went Wrong",
                                                                      });
                                                                  }
                                                                } catch (error) {
                                                                  return error;
                                                                }
                                                              }
                                                            );
                                                          }
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

                                                            if (
                                                              table_flag ===
                                                              "create_member"
                                                            ) {
                                                              let selectquery =
                                                                "select m_userid,member_wallet,member_count,added_wallet,m_phone from create_member where reffer_id = ?";
                                                              connection.query(
                                                                selectquery,
                                                                [reffered_id],
                                                                (
                                                                  err,
                                                                  results
                                                                ) => {
                                                                  if (!err) {
                                                                    let added_wallet =
                                                                      results[0]
                                                                        .added_wallet;
                                                                    let member_wallet =
                                                                      results[0]
                                                                        .member_wallet;
                                                                    let member_count =
                                                                      results[0]
                                                                        ?.member_count;
                                                                    let m_userid =
                                                                      results[0]
                                                                        .m_userid;
                                                                    let memberPhone =
                                                                      results[0]
                                                                        .m_phone;
                                                                    let walletAmount =
                                                                      partnerid.refferal_Amount;

                                                                    let memberdate_query =
                                                                      "select * from member_wallet_history where m_userid = ? ";
                                                                    connection.query(
                                                                      memberdate_query,
                                                                      [
                                                                        m_userid,
                                                                      ],
                                                                      (
                                                                        err,
                                                                        results
                                                                      ) => {
                                                                        // console.log(results[0]?.wallet_update_date,'1033');
                                                                        if (
                                                                          !err
                                                                        ) {
                                                                          var i =
                                                                            results.length -
                                                                            1;
                                                                          let check = false;
                                                                          for (
                                                                            j = 0;
                                                                            j <=
                                                                            i;
                                                                            j++
                                                                          ) {
                                                                            var exist_date =
                                                                              new Date(
                                                                                results[
                                                                                  j
                                                                                ].wallet_update_date
                                                                              );
                                                                            var exist_date1 =
                                                                              exist_date.toLocaleDateString();

                                                                            if (
                                                                              entrydate ===
                                                                              exist_date1
                                                                            ) {
                                                                              check = true;
                                                                            }
                                                                          }
                                                                          if (
                                                                            check
                                                                          ) {
                                                                            member_count =
                                                                              member_count +
                                                                              0;
                                                                          } else {
                                                                            member_count =
                                                                              member_count +
                                                                              1;
                                                                          }
                                                                        }
                                                                      }
                                                                    );
                                                                    // added_wallet = added_wallet + (5 * activePartnerCount);
                                                                    console.log(
                                                                      member_wallet,
                                                                      "557"
                                                                    );

                                                                    if (
                                                                      partnerid.perDayAmounReal ===
                                                                      0
                                                                    ) {
                                                                      member_wallet =
                                                                        member_wallet +
                                                                        0;
                                                                      walletAmount = 0;
                                                                    }

                                                                    if (
                                                                      partnerid.perDayAmounReal !==
                                                                      0
                                                                    ) {
                                                                      member_wallet =
                                                                        member_wallet +
                                                                        partnerid.refferal_Amount;
                                                                      walletAmount =
                                                                        partnerid.refferal_Amount;
                                                                    }

                                                                    // member_count = member_count + 1;
                                                                    let wallet_update_date =
                                                                      new Date();

                                                                    if (
                                                                      member_count ===
                                                                      30
                                                                    ) {
                                                                      let insertquery =
                                                                        "insert into member_withdrawal(member_wallet,request_date,m_userid) values(?,?,?)";
                                                                      connection.query(
                                                                        insertquery,
                                                                        [
                                                                          member_wallet,
                                                                          request_date,
                                                                          m_userid,
                                                                        ],
                                                                        (
                                                                          err,
                                                                          results
                                                                        ) => {
                                                                          if (
                                                                            !err
                                                                          ) {
                                                                            let perday_member_wallet_amount =
                                                                              walletAmount;
                                                                            let updatequery =
                                                                              "update create_member set member_count =?, member_wallet =?,perday_member_wallet_amount=?,added_wallet = ? where m_userid =?";
                                                                            connection.query(
                                                                              updatequery,
                                                                              [
                                                                                (member_count = 0),
                                                                                (member_wallet = 0),
                                                                                (perday_member_wallet_amount = 0),
                                                                                (added_wallet = 0),
                                                                                m_userid,
                                                                              ],
                                                                              (
                                                                                err,
                                                                                results
                                                                              ) => {
                                                                                if (
                                                                                  !err
                                                                                ) {
                                                                                  // Success
                                                                                } else {
                                                                                  return res
                                                                                    .status(
                                                                                      400
                                                                                    )
                                                                                    .json(
                                                                                      {
                                                                                        message:
                                                                                          "Something Went Wrong 3",
                                                                                      }
                                                                                    );
                                                                                }
                                                                              }
                                                                            );
                                                                          } else {
                                                                            return res
                                                                              .status(
                                                                                400
                                                                              )
                                                                              .json(
                                                                                {
                                                                                  message:
                                                                                    "Something Went Wrong 4",
                                                                                }
                                                                              );
                                                                          }
                                                                        }
                                                                      );
                                                                    }

                                                                    //------------------------------------
                                                                    let insertMemberRefferMonthlyPayout =
                                                                      "insert into  member_reffer_withdrawal (reffer_p_userid,member_wallet,request_date,m_userid) values (?,?,?,?)";
                                                                    connection.query(
                                                                      insertMemberRefferMonthlyPayout,
                                                                      [
                                                                        partnerid.p_userid,
                                                                        walletAmount,
                                                                        partnerid.partnerdate,
                                                                        m_userid,
                                                                      ],
                                                                      (
                                                                        err,
                                                                        results
                                                                      ) => {}
                                                                    );
                                                                    let selectMemberRefferWalletHistory =
                                                                      "select * from member_reffer_wallet_history where reffer_p_userid =?";
                                                                    connection.query(
                                                                      selectMemberRefferWalletHistory,
                                                                      [
                                                                        partnerid.p_userid,
                                                                      ],
                                                                      (
                                                                        err,
                                                                        results
                                                                      ) => {
                                                                        let member_wallet =
                                                                          results[0]
                                                                            ?.member_wallet;

                                                                        member_wallet =
                                                                          member_wallet +
                                                                          walletAmount;

                                                                        if (
                                                                          results.length <
                                                                          1
                                                                        ) {
                                                                          let insertMemberRefferWalletHistory =
                                                                            " insert into member_reffer_wallet_history (m_userid,member_wallet,wallet_update_date,reffer_p_userid) values (?,?,?,?)";
                                                                          connection.query(
                                                                            insertMemberRefferWalletHistory,
                                                                            [
                                                                              m_userid,
                                                                              walletAmount,
                                                                              partnerid.partnerdate,
                                                                              partnerid.p_userid,
                                                                            ],
                                                                            (
                                                                              err,
                                                                              results
                                                                            ) => {}
                                                                          );
                                                                        }
                                                                        if (
                                                                          results.length >
                                                                          0
                                                                        ) {
                                                                          console.log(
                                                                            "1126"
                                                                          );
                                                                          let updateMemberRefferWalletHistory =
                                                                            "update member_reffer_wallet_history set member_wallet =?, wallet_update_date =? where reffer_p_userid =?";
                                                                          connection.query(
                                                                            updateMemberRefferWalletHistory,
                                                                            [
                                                                              member_wallet,
                                                                              partnerid.partnerdate,
                                                                              partnerid.p_userid,
                                                                            ],
                                                                            (
                                                                              err,
                                                                              results
                                                                            ) => {
                                                                              console.log(
                                                                                results,
                                                                                "1129"
                                                                              );
                                                                            }
                                                                          );
                                                                        }

                                                                        let selectquery =
                                                                          "select partner_count from mining_partner where p_userid = ?";
                                                                        connection.query(
                                                                          selectquery,
                                                                          [
                                                                            partnerid.p_userid,
                                                                          ],
                                                                          (
                                                                            err,
                                                                            results
                                                                          ) => {
                                                                            let partner_count =
                                                                              results[0]
                                                                                ?.partner_count;
                                                                            console.log(
                                                                              results[0]
                                                                                ?.partner_count,
                                                                              "1137"
                                                                            );

                                                                            if (
                                                                              partner_count ===
                                                                              30
                                                                            ) {
                                                                              let selectMemberRefferWalletHistory =
                                                                                "select * from member_reffer_wallet_history where reffer_p_userid =?";
                                                                              connection.query(
                                                                                selectMemberRefferWalletHistory,
                                                                                [
                                                                                  partnerid.p_userid,
                                                                                ],
                                                                                (
                                                                                  err,
                                                                                  results
                                                                                ) => {
                                                                                  let m_userid =
                                                                                    results[0]
                                                                                      ?.m_userid;
                                                                                  let member_wallet =
                                                                                    results[0]
                                                                                      ?.member_wallet;
                                                                                  let reffer_p_userid =
                                                                                    results[0]
                                                                                      ?.reffer_p_userid;

                                                                                  let insertMemberRefferWithdrawal =
                                                                                    "insert into member_reffer_withdrawal (m_userid,member_wallet,request_date,reffer_p_userid) values (?,?,?,?)";
                                                                                  connection.query(
                                                                                    insertMemberRefferWithdrawal,
                                                                                    [
                                                                                      m_userid,
                                                                                      member_wallet,
                                                                                      partnerid.partnerdate,
                                                                                      reffer_p_userid,
                                                                                    ],
                                                                                    (
                                                                                      err,
                                                                                      results
                                                                                    ) => {
                                                                                      if (
                                                                                        !err
                                                                                      ) {
                                                                                        let updateMemberRefferWalletHistory =
                                                                                          "update member_reffer_wallet_history set member_wallet =?, wallet_update_date =? where reffer_p_userid =?";
                                                                                        connection.query(
                                                                                          updateMemberRefferWalletHistory,
                                                                                          [
                                                                                            (member_wallet = 0),
                                                                                            partnerid.partnerdate,
                                                                                            partnerid.p_userid,
                                                                                          ],
                                                                                          (
                                                                                            err,
                                                                                            results
                                                                                          ) => {}
                                                                                        );
                                                                                      }
                                                                                    }
                                                                                  );
                                                                                }
                                                                              );
                                                                            }
                                                                          }
                                                                        );
                                                                      }
                                                                    );

                                                                    //--------------------------------------

                                                                    let insertquery =
                                                                      "insert into member_wallet_history(walletAmount,wallet_update_date,m_userid,reffer_user) values (?,?,?,?)";
                                                                    connection.query(
                                                                      insertquery,
                                                                      [
                                                                        walletAmount,
                                                                        partnerid.partnerdate,
                                                                        m_userid,
                                                                        partnerid.p_userid,
                                                                      ],
                                                                      (
                                                                        err,
                                                                        results
                                                                      ) => {
                                                                        if (
                                                                          !err
                                                                        ) {
                                                                          if (
                                                                            partnerid.perDayAmounReal ===
                                                                            0
                                                                          ) {
                                                                            memberWalletSms(
                                                                              memberPhone,
                                                                              {
                                                                                type: "Member",
                                                                                userid:
                                                                                  m_userid,
                                                                                amount:
                                                                                  partnerid.perDayAmounReal,
                                                                              }
                                                                            );
                                                                          }
                                                                          if (
                                                                            partnerid.perDayAmounReal !=
                                                                            0
                                                                          ) {
                                                                            memberWalletSms(
                                                                              memberPhone,
                                                                              {
                                                                                type: "Member",
                                                                                userid:
                                                                                  m_userid,
                                                                                amount:
                                                                                  walletAmount,
                                                                              }
                                                                            );
                                                                          }

                                                                          let perday_member_wallet_amount =
                                                                            walletAmount;

                                                                          let updatequery =
                                                                            "update create_member set member_wallet=?,wallet_update_date=?,member_count=?,perday_member_wallet_amount=?,added_wallet = ? where m_userid =?";
                                                                          connection.query(
                                                                            updatequery,
                                                                            [
                                                                              member_wallet,
                                                                              partnerid.partnerdate,
                                                                              member_count,
                                                                              perday_member_wallet_amount,
                                                                              added_wallet,
                                                                              m_userid,
                                                                            ],
                                                                            (
                                                                              err,
                                                                              results
                                                                            ) => {
                                                                              if (
                                                                                !err
                                                                              ) {
                                                                                // if (activePartnerCount === 0) {
                                                                                //     let setTotalWalletZero = "update create_member set member_count =?, member_wallet =?,perday_member_wallet_amount=? where m_userid =?";
                                                                                //     connection.query(setTotalWalletZero, [member_count = 0, member_wallet = 0, perday_member_wallet_amount = 0, m_userid], (err, results) => {
                                                                                //         if (!err) {
                                                                                //         }
                                                                                //     })
                                                                                // }
                                                                              }
                                                                            }
                                                                          );
                                                                        }
                                                                      }
                                                                    );
                                                                  } else {
                                                                    return res
                                                                      .status(
                                                                        400
                                                                      )
                                                                      .json({
                                                                        messgae:
                                                                          "Something Went Wrong 5",
                                                                      });
                                                                  }
                                                                }
                                                              );
                                                            }
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
                    console.log(results, "1203");
                    let partner_count = results[0]?.partner_count;
                    let partner_wallet = results[0]?.partner_wallet;
                    //let perday_partner_wallet_amount = results[0]?.perday_partner_wallet_amount;
                    console.log(partner_count, partner_wallet, "1203");

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

                            console.log(table_flag);
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
  console.log(partnerId.id, "250");
  let query =
    "select partner_wallet,request_date,id,reffer_p_userid,p_userid from partner_reffer_withdrawal where id = ? ";
  connection.query(query, [partnerId.id], (err, results) => {
    if (!err) {
      //console.log(res);
      console.log(results);

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
                      console.log(partnerPhone, "270");
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
  let query =
    "select m_userid,member_wallet,request_date,id,reffer_p_userid from member_reffer_withdrawal ";
  connection.query(query, (err, results) => {
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
  const partnerId = req.body;
  console.log(partnerId.id, "250");
  const query =
    "SELECT member_wallet, request_date, id, reffer_p_userid, m_userid FROM member_reffer_withdrawal WHERE id = ?";

  connection.query(query, [partnerId.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Withdrawal request not found" });
    }

    const { member_wallet, id, request_date, reffer_p_userid, m_userid } =
      results[0];
    const approve_date = new Date();
    const insertQuery =
      "INSERT INTO member_reffer_withdrawal_history (member_wallet, request_date, approve_date, reffer_p_userid, m_userid) VALUES (?, ?, ?, ?, ?)";

    connection.query(
      insertQuery,
      [member_wallet, request_date, approve_date, reffer_p_userid, m_userid],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error" });
        }

        const selectQuery =
          "SELECT m_email, m_phone FROM create_member WHERE m_userid = ?";

        connection.query(selectQuery, [partnerId.m_userid], (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
          }

          if (results.length === 0) {
            return res.status(404).json({ message: "Member not found" });
          }

          const memberEmail = results[0]?.m_email;
          const memberPhone = results[0]?.m_phone;

          console.log(memberPhone, "270");
          // withdrawalSms(memberPhone, {
          //   type: "Member",
          //   userid: m_userid,
          //   amount: member_wallet,
          // });

          email(memberEmail, { withdrawalAmount: member_wallet });

          const deleteQuery =
            "DELETE FROM member_reffer_withdrawal WHERE id = ?";
          connection.query(deleteQuery, [id], (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Database error" });
            }

            return res
              .status(200)
              .json({ message: "Member Referral Withdrawal Request Approved" });
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
  //console.log(originalname,mimetype,filename,p_userid);
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
      //console.log(sumOfPartnerWallet,'1763');
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
                results[0].sumOfRefferalMemberWallet;
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

exports.accountsPaidWithdrawal = (req, res) => {
  const query1 =
    "SELECT SUM(partner_wallet) AS sumOfPartnerWallet FROM partner_withdrawal_history";

  connection.query(query1, (err1, results1) => {
    if (err1) {
      return res.status(500).json(err1);
    }

    const sumOfPartnerWallet = results1[0].sumOfPartnerWallet;

    const query2 =
      "SELECT SUM(partner_wallet) AS sumOfRefferPartnerWallet FROM partner_reffer_withdrawal_history";

    connection.query(query2, (err2, results2) => {
      if (err2) {
        return res.status(500).json(err2);
      }

      const sumOfRefferPartnerWallet = results2[0].sumOfRefferPartnerWallet;

      const query3 =
        "SELECT SUM(member_wallet) AS sumOfRefferalMemberWallet FROM member_reffer_withdrawal_history";

      connection.query(query3, (err3, results3) => {
        if (err3) {
          return res.status(500).json(err3);
        }

        const sumOfRefferalMemberWallet = results3[0].sumOfRefferalMemberWallet;

        const totalWithdrawal =
          sumOfPartnerWallet +
          sumOfRefferPartnerWallet +
          sumOfRefferalMemberWallet;

        return res.status(200).json({
          message: "Fetched Sum Of All Member Wallet successfully",
          partner: sumOfPartnerWallet,
          reffrePartner: sumOfRefferPartnerWallet,
          refferalMember: sumOfRefferalMemberWallet,
          totalWithdrawal: totalWithdrawal,
        });
      });
    });
  });
};

exports.fetchAllFranchise = (req, res) => {
  const selectAllFranchiseQuery = "SELECT * FROM create_franchise";

  connection.query(selectAllFranchiseQuery, (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Internal server error" });
    }

    console.log(results, "jjjj");

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
    const { m_userid, isVerify } = req.body;

    if (typeof isVerify != "boolean") {
      return res.status(400).json({ message: "Invalid 'isVerify' value" });
    }

    const upadteMemberQuery =
      "UPDATE create_member SET isVerify =? WHERE m_userid = ?";

    connection.query(
      upadteMemberQuery,
      [isVerify, m_userid],
      (error, result) => {
        if (error) {
          console.error("Error updating Member:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows == 0) {
          return res.status(200).json({ message: "Member not found" });
        }

        return res.status(200).json({ message: "Member verified" });
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
  let query = "select *from mining_partner";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched data successfully",
        miningPartnerData: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// adminVerifyPartner
exports.adminVerifyPartner = async (req, res) => {
  try {
    const { p_userid, isVerify } = req.body;

    if (typeof isVerify != "boolean") {
      return res.status(400).json({ message: "Invalid 'isVerify' value" });
    }

    const upadtePartnerQuery =
      "UPDATE mining_partner SET isVerify =? WHERE p_userid = ?";

    connection.query(
      upadtePartnerQuery,
      [isVerify, p_userid],
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
        "SELECT bank_name FROM bank_details WHERE user_id = ?";
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

        if (results.length == 0) {
          return res.status(404).json({ message: "Payment request not found" });
        }

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
  const memberId = req.body;
  try {
    let query = "select * from member_reffer_withdrawal where m_userid = ?";
    connection.query(query, [memberId.m_userid], (err, results) => {
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
  let memberId = req.body;
  let query =
    "select * from member_reffer_withdrawal_history where m_userid =? ";
  connection.query(query, [memberId.m_userid], (err, results) => {
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
        console.log(member, "member details");
      });

      const findPartner = "select * from mining_partner where p_refferal_id =?";

      connection.query(findPartner, [referredId], (error, result) => {
        if (error) {
          console.log(error.message);
        }

        const refferredPartner = result[0];
        console.log(refferredPartner, " reffered partner details");
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
        "SELECT bank_name FROM bank_details WHERE user_id = ?";
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
                        message: "Franchise payment request approved successfully",
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
