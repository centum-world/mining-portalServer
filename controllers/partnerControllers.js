const cron = require("node-cron");
const connection = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const forgetpasswordSms = require("../utils/forget-password-otp");
const sms = require("../utils/successfull-add-sms");
const email = require("../utils/withdrawal-email");
const walletSms = require("../utils/wallet-amount-sms");
const memberWalletSms = require("../utils/member-wallet-amount-sms");
const {
  isValidImage,
  isValidEmail,
  isValidPhone,
  isValidName,
  isValidPassword,
  isValidUserId,
} = require("../utils/validation");

require("dotenv").config();

// mining Partner Login

// exports.miningPartnerLogin = (req, res, next) => {
//     const mining = req.body;
//     query = "select p_userid, p_password, p_refferal_id,p_liquidity,partner_wallet,partner_status from mining_partner where p_userid=?";
//     connection.query(query, [mining.p_userid], (err, results) => {
//         if (!err) {
//             if (results.length <= 0 || results[0].p_password != mining.p_password) {
//                 return res.status(401).json({ message: "Incorrect username or password" });
//             } else if (results[0].p_password == mining.p_password) {
//                 const response = { p_userid: results[0].p_userid }

//                 const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
//                 res.status(200).json({
//                     token: accessToken,
//                     message: "Successfully logedIn",
//                     data: results

//                 });
//             } else {
//                 return res.status(400).json({ message: "Something went wrong" });
//             }

//         } else {
//             return res.status(500).json(err);
//         }
//     })
// }

// partner hash password login

exports.miningPartnerLogin = (req, res) => {
  const mining = req.body;
  let query =
    "select p_userid, p_password,p_refferal_id,p_liquidity,partner_wallet,partner_status,rigId from mining_partner where p_userid=?";
  connection.query(query, [mining.p_userid], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        bcrypt.compare(
          mining.p_password,
          results[0].p_password,
          function (err, result) {
            if (result) {
              const response = {
                p_userid: results[0].p_userid,
                role: "partner",
              };
              const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
                expiresIn: 28800,
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

// Fetch Mining Profile Details
exports.miningPartnerProfileDetails = (req, res) => {
  const partnerId = req.body;
  query = "select *from mining_partner where p_userid = ?";
  connection.query(query, [partnerId.p_userid], (err, results) => {
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

// Add Partner Bank Details

exports.addPartnerBankDetails = (req, res) => {
  const bank = req.body;

  // Check if any required details are missing
  if (
    !bank.user_id ||
    !bank.holder_name ||
    !bank.account_no ||
    !bank.ifsc_code ||
    !bank.branch_name ||
    !bank.bank_name
  ) {
    return res.status(400).json({
      message: "Please provide all necessary information.",
    });
  }

  let query =
    "INSERT INTO bank_details(user_id, holder_name, account_no, ifsc_code, branch_name, bank_name) VALUES (?, ?, ?, ?, ?, ?)";
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

//make primary

//fetch-partner-bank-details

exports.fetchPartnerBankDetails = (req, res) => {
  const partnerId = req.body;
  query = "select * from bank_details where user_id = ?";
  connection.query(query, [partnerId.user_id], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Bank data successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// update-partner-data

exports.updatePartnerData = (req, res) => {
  let partner = req.body;
  query =
    "update mining_partner set p_name=?, p_lname=?, p_phone=?, p_aadhar=?,p_email=?,p_address=?,p_state=?,p_nominee_name=?,p_nominee_aadhar=?,p_nominee_phone=?,p_dob=? where p_userid=? ";
  connection.query(
    query,
    [
      partner.p_name,
      partner.p_lname,
      partner.p_phone,
      partner.p_aadhar,
      partner.p_email,
      partner.p_address,
      partner.p_state,
      partner.p_nominee_name,
      partner.p_nominee_aadhar,
      partner.p_nominee_phone,
      partner.p_dob,
      partner.p_userid,
    ],
    (err, results) => {
      if (!err) {
        return res.status(200).json({
          message: "Partner Data Updated successfully",
        });
      } else {
        return res.status(500).json({
          message: err,
        });
      }
    }
  );
};

// fetch-partner-refferal-id

exports.fetchPartnerRefferalId = (req, res) => {
  const partnerid = req.body;
  query = "select p_refferal_id from mining_partner where p_userid = ?";
  connection.query(query, [partnerid.p_userid], (err, results) => {
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

//  fetch-partner-myteam-details

exports.fetchPartnerMyteamDetails = (req, res) => {
  const partnerId = req.body;
  query =
    "select p_name,p_lname,p_userid,p_dop,p_phone,p_email from mining_partner where p_reffered_id = ?";
  connection.query(query, [partnerId.p_reffered_id], (err, results) => {
    try {
      if (!err) {
        return res.status(200).json({
          message: "Fetched  Partner My Team data successfully",
          data: results,
        });
      } else {
        return res.status(500).json(err);
      }
    } catch (error) {
      return res.status(500).json(err);
    }
  });
};

// fetch-partner-wallet-details

exports.fetchPartnerWalletDetails = (req, res, next) => {
  let reffered_id = "";
  let table_flag = "";
  let activePartnerCount = 0;

  const partnerid = req.body;
  query =
    "select partner_wallet,p_reffered_id,partner_status, p_liquidity,partner_count,login_counter from mining_partner where p_userid = ?";
  connection.query(query, [partnerid.p_userid], (err, results) => {
    if (!err) {
      let login_counter = results[0].login_counter;
      let status = results[0].partner_status;
      //let partner_count = results[0].partner_count;
      login_counter = login_counter + 1;

      updatequery =
        " update mining_partner set login_counter = ? where p_userid = ?";
      connection.query(
        updatequery,
        [login_counter, partnerid.p_userid],
        (err, results) => {
          try {
            if (!err) {
              // return res.status(200).json({
              //     message: "Login Counter updated"
              //})
            }
          } catch (error) {
            return res.status(500).json({
              message: "Bad Connection",
            });
          }
        }
      );

      if (status) {
        let selectquery =
          " select login_counter from mining_partner where p_userid = ? ";
        connection.query(selectquery, [partnerid.p_userid], (err, results) => {
          try {
            if (!err) {
              login_counter = results[0].login_counter;
            } else {
              return res.status(400).json({
                message: "Something Went wrong",
              });
            }
          } catch (error) {
            return res.status(500).json({
              message: "Internal Server Error",
            });
          }
        });

        if (login_counter === 1) {
          cron.schedule(" */10 * * * * * ", function () {
            selectquery =
              " select partner_wallet,p_reffered_id,partner_status, p_liquidity,partner_count,month_count from mining_partner where p_userid = ?";
            connection.query(
              selectquery,
              [partnerid.p_userid],
              (err, results) => {
                try {
                  if (!err) {
                    let liquidity = results[0].p_liquidity;
                    let partner_wallet = results[0].partner_wallet;
                    let status = results[0].partner_status;
                    let month_count = results[0].month_count;
                    let partner_count = results[0].partner_count;
                    let walletAmount = liquidity / 20000;
                    partner_count = partner_count + 1;
                    partner_wallet = partner_wallet + walletAmount;
                    let request_date = new Date();

                    if (status) {
                      if (partner_count === 5 || partner_count > 5) {
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
                                  (partner_wallet = 0),
                                  (partner_count = 0),
                                  month_count,
                                  partnerid.p_userid,
                                ],
                                (err, results) => {
                                  try {
                                    if (!err) {
                                      return res.status(200).json({
                                        message: "Mining Partner Set Zero ",
                                      });
                                    } else {
                                      return res.status(404).json({
                                        message: "Something Went Wrong",
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
                      } /// 30 days condition

                      if (month_count === 11 || month_count > 11) {
                        let updatequery =
                          "update mining_partner set partner_status= ? where p_userid = ?";
                        connection.query(
                          updatequery,
                          [(partner_status = 0), partnerid.p_userid],
                          (err, results) => {
                            try {
                              if (!err) {
                                return res.status(400).json({
                                  message: "Your Plan has been expired ",
                                });
                              } else {
                                return res.status(400).json({
                                  message: "Something Went wrong",
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

                              if (month_count < 11) {
                                let wallet_update_date = new Date();

                                let perday_partner_wallet_amount = walletAmount;
                                query =
                                  "update mining_partner  set partner_wallet=?,wallet_update_date=?,partner_count=?,perday_partner_wallet_amount=? where p_userid =?";
                                connection.query(
                                  query,
                                  [
                                    partner_wallet,
                                    wallet_update_date,
                                    partner_count,
                                    perday_partner_wallet_amount,
                                    partnerid.p_userid,
                                  ],
                                  (err, results) => {
                                    try {
                                      if (!err) {
                                        let insertquery =
                                          "insert into partner_wallet_history (walletAmount,wallet_update_date,p_userid) values (?,?,?)";
                                        connection.query(
                                          insertquery,
                                          [
                                            walletAmount,
                                            new Date(),
                                            partnerid.p_userid,
                                          ],
                                          (err, results) => {
                                            try {
                                              if (!err) {
                                                // walletSms(p_phone, { "type": 'Partner', "userid": partnerid.p_userid, "amount": walletAmount })
                                                // return res.status(200).json({
                                                //     message: "Partner Wallet Added successfully"
                                                // });
                                              } else {
                                                // return res.status(500).json(err);
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
                              message: "Something Went Wrong",
                            });
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
                            if (results[0]?.p_reffered_id != "") {
                              reffered_id = results[0]?.p_reffered_id;

                              let selectquery =
                                "select id from mining_partner where p_refferal_id= ?";
                              connection.query(
                                selectquery,
                                [reffered_id],
                                (err, results) => {
                                  if (!err) {
                                    if (results[0]?.id) {
                                      table_flag = "mining_partner";
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
                                        table_flag = "create_member";
                                      }
                                    }
                                  }
                                );
                              }
                            }
                          }
                        }
                      );

                      // closing of check reffer flag

                      // if (table_flag === 'mining_partner') {

                      //     let refferquery = "select p_reffered_id from mining_partner where p_userid = ?";
                      //     connection.query(refferquery, [partnerid.p_userid], (err, results) => {

                      //         try {
                      //             console.log(results[0].p_reffered_id);
                      //             reffered_id = results[0].p_reffered_id;
                      //             if (!err) {

                      //                 let query = "select p_userid,partner_wallet,partner_count from mining_partner where p_refferal_id = ?";
                      //                 connection.query(query, [reffered_id], (err, results) => {
                      //                     let partner_wallet = results[0].partner_wallet;
                      //                     let partner_count = results[0].partner_count;
                      //                     let p_userid = results[0].p_userid;
                      //                     let walletAmount = 5;
                      //                     partner_count = partner_count + 1;
                      //                     partner_wallet = partner_wallet + walletAmount;
                      //                     let wallet_update_date = new Date();

                      //                     let updatequery = "update mining_partner set partner_wallet=?,wallet_update_date=?,partner_count=? where p_refferal_id =?"
                      //                     connection.query(updatequery, [partner_wallet, wallet_update_date, partner_count, reffered_id], (err, results) => {

                      //                         try {
                      //                             if (!err) {
                      //                                 // return res.status(200).json({
                      //                                 //     message: "Mining Partner Updated Successfully"
                      //                                 // })

                      //                                 let insertquery = "insert into partner_wallet_history (walletAmount,wallet_update_date,p_userid) values (?,?,?)";
                      //                                 connection.query(insertquery, [walletAmount, wallet_update_date, p_userid], (err, results) => {

                      //                                     try {
                      //                                         if (!err) {
                      //                                             return res.status(200).json({
                      //                                                 message: "Data Inserted into Partner Wallet History Successfully"
                      //                                             })
                      //                                         } else {
                      //                                             return res.status(404).json({
                      //                                                 message: "Something Went Wrong"
                      //                                             })
                      //                                         }
                      //                                     } catch (error) {
                      //                                         return error;
                      //                                     }

                      //                                 });

                      //                             } else {
                      //                                 return res.status(404).json({
                      //                                     message: "Something Went Wrong"
                      //                                 })
                      //                             }
                      //                         } catch (error) {
                      //                             return error;
                      //                         }

                      //                     });

                      //                     if (partner_count === 5 || partner_count > 5) {

                      //                         let insertquery = "insert into partner_withdrawal (partner_wallet,request_date,p_userid) values (?,?,?)";
                      //                         connection.query(insertquery, [partner_wallet, request_date, p_userid], (err, results) => {

                      //                             try {
                      //                                 if (!err) {
                      //                                     let updatequery = "update mining_partner set partner_wallet =?, partner_count=? where p_userid = ?";
                      //                                     connection.query(updatequery, [partner_wallet = 0, partner_count = 0, p_userid], (err, results) => {

                      //                                         try {
                      //                                             if (!err) {
                      //                                                 return res.status(200).json({
                      //                                                     messgae: "Mining Partner Set To Zero"
                      //                                                 })
                      //                                             } else {
                      //                                                 return res.status(404).json({
                      //                                                     messgae: "Something Went Wrong"
                      //                                                 })
                      //                                             }
                      //                                         } catch (error) {
                      //                                             return error;
                      //                                         }

                      //                                     });
                      //                                 } else {
                      //                                     return res.status(404).json({
                      //                                         message: "Something Went Wrong"
                      //                                     })
                      //                                 }

                      //                             } catch (error) {

                      //                                 return error;
                      //                             }

                      //                         });
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
                      if (table_flag === "create_member") {
                        let selectquery =
                          "select m_userid,member_wallet,member_count,added_wallet,m_phone from create_member where reffer_id = ?";
                        connection.query(
                          selectquery,
                          [reffered_id],
                          (err, results) => {
                            if (!err) {
                              let activePartnerCountQuery =
                                "select count(*) AS activePartner from mining_partner join create_member on mining_partner.p_reffered_id = create_member.reffer_id WHERE  mining_partner.p_reffered_id = ? AND mining_partner.partner_status ='1'";
                              connection.query(
                                activePartnerCountQuery,
                                [reffered_id],
                                (err, results) => {
                                  //try {
                                  if (!err) {
                                    activePartnerCount = Number(
                                      results[0]?.activePartner
                                    );
                                    console.log(activePartnerCount, "534---");
                                  }
                                  // } catch (error) {
                                  //     return res.status(500).json({message:"server error"})
                                  // }
                                }
                              );

                              let added_wallet = results[0].added_wallet;
                              let member_wallet = results[0].member_wallet;
                              let member_count = results[0].member_count;
                              let m_userid = results[0].m_userid;
                              let memberPhone = results[0].m_phone;

                              let walletAmount = 5;
                              added_wallet =
                                added_wallet + 5 * activePartnerCount;
                              member_wallet = member_wallet + 5;
                              member_count = member_count + 1;
                              let wallet_update_date = new Date();

                              if (member_count === 5 || member_count > 5) {
                                let insertquery =
                                  "insert into member_withdrawal(member_wallet,request_date,m_userid) values(?,?,?)";
                                connection.query(
                                  insertquery,
                                  [member_wallet, request_date, m_userid],
                                  (err, results) => {
                                    if (!err) {
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
                                        (err, results) => {
                                          if (!err) {
                                          } else {
                                            return res.status(400).json({
                                              message: "Something Went Wrong",
                                            });
                                          }
                                        }
                                      );
                                    } else {
                                      return res.status(400).json({
                                        message: "Something Went Wrong",
                                      });
                                    }
                                  }
                                );
                              }

                              let insertquery =
                                "insert into member_wallet_history(walletAmount,wallet_update_date,m_userid) values (?,?,?)";
                              connection.query(
                                insertquery,
                                [walletAmount, wallet_update_date, m_userid],
                                (err, results) => {
                                  if (!err) {
                                    //  memberWalletSms(memberPhone, { "type": 'Member', "userid":m_userid, "amount": walletAmount })

                                    let perday_member_wallet_amount =
                                      walletAmount;
                                    let updatequery =
                                      "update create_member set member_wallet=?,wallet_update_date=?,member_count=?,perday_member_wallet_amount=?,added_wallet = ? where m_userid =?";
                                    connection.query(
                                      updatequery,
                                      [
                                        member_wallet,
                                        wallet_update_date,
                                        member_count,
                                        perday_member_wallet_amount,
                                        added_wallet,
                                        m_userid,
                                      ],
                                      (err, results) => {
                                        if (!err) {
                                          if (activePartnerCount === 0) {
                                            let setTotalWalletZero =
                                              "update create_member set member_count =?, member_wallet =?,perday_member_wallet_amount=?,added_wallet = ? where m_userid =?";
                                            connection.query(
                                              setTotalWalletZero,
                                              [
                                                (member_count = 0),
                                                (member_wallet = 0),
                                                (perday_member_wallet_amount = 0),
                                                (added_wallet = 0),
                                                m_userid,
                                              ],
                                              (err, results) => {
                                                if (!err) {
                                                }
                                              }
                                            );
                                          }
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            } else {
                              return res.status(400).json({
                                messgae: "Something Went Wrong",
                              });
                            }
                          }
                        );
                      }
                    }
                    // else {
                    //     return res.status(400).json({

                    //         message: "Your Plan has been expired"

                    //     })
                    // }
                  } else {
                    return res.status(400).json({
                      message: "Something went Wrong",
                    });
                  }
                } catch (error) {
                  return res.status(500).json(err);
                }
              }
            );
          });
        }
      } else {
        return res.status(400).json({
          message: "Account is Not Active",
        });
      }
    }
  });
};

exports.fetchMiningPartnerTotalWallet = (req, res) => {
  const partnerId = req.body;
  let firstWalletAmount = 0;
  let refferWalletAmount = 0;
  query = "select partner_wallet from mining_partner where p_userid = ?";
  connection.query(query, [partnerId.p_userid], (err, results) => {
    if (!err) {
      firstWalletAmount = results[0]?.partner_wallet;

      let selectqueryforaddingwallet =
        "select sum(partner_wallet) as addedWalletOfRefferal from  partner_reffer_wallet where p_userid = ?";
      connection.query(
        selectqueryforaddingwallet,
        [partnerId.p_userid],
        (err, results) => {
          if (!err) {
            refferWalletAmount = results[0].addedWalletOfRefferal;
            let TotalWalletOfPartner = firstWalletAmount + refferWalletAmount;

            return res.status(200).json({
              message: "Sum of Partner Total Wallet Fetched",
              results: TotalWalletOfPartner,
            });
          }
        }
      );
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetch-partner-wallet-daily-history

exports.fetchPartnerWalletDailyHistory = (req, res) => {
  const partnerId = req.body;
  query = "select * from partner_wallet_history where p_userid = ?";
  connection.query(query, [partnerId.p_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Partner Wallet Daily data successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetch-partner-approve-withdrawal-history-for-partner

exports.fetchPartnerApproveWithdrawalHistoryForPartner = (req, res) => {
  const partnerId = req.body;
  query = "select * from partner_withdrawal_history where p_userid = ? ";
  connection.query(query, [partnerId.p_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message:
          "Fetched Partner Withdrawal History for Particular Partner successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetch-sum-of-partner-all-withdrawal

exports.fetchSumOfPartnerAllWithdrawal = (req, res) => {
  const partnerId = req.body;
  let myWithdrawalAmount = 0;
  let myRefferalWithdrawalAmount = 0;
  query =
    "select sum(partner_wallet) as sumOfPartnerWallet  from partner_withdrawal_history where p_userid = ?";
  connection.query(query, [partnerId.p_userid], (err, results) => {
    if (!err) {
      myWithdrawalAmount = results[0]?.sumOfPartnerWallet;

      // return res.status(200).json({
      //     message: "Fetched Sum Of Partner All Withdrawal successfully",
      //     data: results
      // });
      let selectqueryforaddingpartnerwithdrawal =
        "select sum(partner_wallet) as sumOfPartnerWalletReffer from partner_reffer_withdrawal_history where p_userid = ?";
      connection.query(
        selectqueryforaddingpartnerwithdrawal,
        [partnerId.p_userid],
        (err, results) => {
          if (!err) {
            myRefferalWithdrawalAmount = results[0]?.sumOfPartnerWalletReffer;
            let totalWithdrawalOfPartner =
              myWithdrawalAmount + myRefferalWithdrawalAmount;

            return res.status(200).json({
              message: "Sum Of Partner All withdrawal successfull",
              results: totalWithdrawalOfPartner,
            });
          }
        }
      );
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetch-partner-withdrawal-request-for-partner

exports.fetchPartnerWithdrawalRequestForPartner = (req, res) => {
  const partnerId = req.body;
  query = "select * from partner_withdrawal where p_userid = ?";
  connection.query(query, [partnerId.p_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Bank data successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// perday-partner-wallet-amount

exports.perdayPartnerWalletAmount = (req, res) => {
  let partnerId = req.body;
  let query =
    "select  perday_partner_wallet_amount,wallet_update_date from mining_partner where p_userid = ?";
  connection.query(query, [partnerId.p_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Perday Wallet amount successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// forget-password

exports.partnerForgetPassword = (req, res) => {
  const partnerId = req.body;
  let query = "select p_phone from mining_partner where p_userid = ? ";
  connection.query(query, [partnerId.p_userid], (err, results) => {
    const phone = results[0]?.p_phone;

    if (results.length > 0) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      let updatequery = "update mining_partner set otp =? where p_userid = ?";

      connection.query(
        updatequery,
        [otp, partnerId.p_userid],
        (err, results) => {
          if (!err) {
            forgetpasswordSms(phone, {
              type: "Partner",
              userid: partnerId.p_userid,
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

exports.verifyOtpPartner = (req, res) => {
  const partnerId = req.body;
  if (!partnerId.p_userid || !partnerId.otp) {
    return res.status(400).json({ message: "Field Missing" });
  }
  let query = "select otp from mining_partner where p_userid = ? ";
  connection.query(query, [partnerId.p_userid], (err, results) => {
    if (!err) {
      const otp = results[0]?.otp;

      if (results.length > 0) {
        //res.status(200).json({message:"otp",otp})
        if (partnerId.otp === otp) {
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

// Regenerate password
exports.partnerRegeneratePassword = (req, res) => {
  const partnerId = req.body;
  const password = partnerId.p_password;
  if (!partnerId.p_userid || !partnerId.p_password) {
    return res.status(400).json({ message: "Field Missing" });
  }
  selectquery = "select p_phone from mining_partner where p_userid = ?";
  connection.query(selectquery, [partnerId.p_userid], (err, result) => {
    if (!err) {
      phone = result[0]?.p_phone;
    }

    bcrypt.hash(partnerId.p_password, 10, function (err, result) {
      if (err) {
        throw err;
      }
      hash = result;

      updatequery =
        "update mining_partner set p_password = ? where p_userid = ?";
      connection.query(
        updatequery,
        [hash, partnerId.p_userid],
        (err, results) => {
          if (!err) {
            sms(phone, {
              type: "Partner",
              userid: partnerId.p_userid,
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

// partner-refferal-perday-wallet-history
exports.partnerRefferalPerDayWalletHistory = (req, res) => {
  let partnerId = req.body;
  let query = "select * from partner_reffer_wallet_history where p_userid = ?";
  connection.query(query, [partnerId.p_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Perday Refferal Wallet amount successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// isPartnerActiveFromPartner
exports.isPartnerActiveFromPartner = (req, res) => {
  let partnerid = req.body;

  let query =
    "SELECT p_liquidity,p_dop,month_count,partner_status,p_name,p_lname,partner_count from mining_partner where p_userid = ? ";
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

// fetchPartnerRefferalWithdrawalHistoryFromPartner
exports.fetchPartnerRefferalWithdrawalHistoryFromPartner = (req, res) => {
  const partnerId = req.body;
  query =
    "select * from partner_reffer_withdrawal_history where reffer_p_userid = ?";
  connection.query(query, [partnerId.p_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Partner Refferal Withdrawal History successfully",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchRefferPartnerWithdrawalRequest
exports.fetchRefferPartnerWithdrawalRequest = (req, res) => {
  const partnerId = req.body;
  query = "select * from partner_reffer_withdrawal where p_userid = ?";
  connection.query(query, [partnerId.p_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Reffer Partner Withdrawal Request",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// fetchRefferPartnerWithdrawalSuccessHistory
exports.fetchRefferPartnerWithdrawalSuccessHistory = (req, res) => {
  const partnerId = req.body;
  query = "select * from partner_reffer_withdrawal_history where p_userid = ?";
  connection.query(query, [partnerId.p_userid], (err, results) => {
    if (!err) {
      return res.status(200).json({
        message: "Fetched Reffer Partner Withdrawal history",
        data: results,
      });
    } else {
      return res.status(500).json(err);
    }
  });
};

// helpAndSupport
exports.helpAndSupport = (req, res) => {
  const partnerId = req.body;
  let query = req.body.query;
  let p_userid = req.body.p_userid;
  let queryDate = new Date();
  let helpAndSupportQuery =
    "insert into help_and_support (query,query_date,p_userid) values(?,?,?) ";
  connection.query(
    helpAndSupportQuery,
    [query, queryDate, p_userid],
    (err, results) => {
      if (!err) {
        return res.status(201).json({
          message: "Query submitted!",
        });
      } else {
        return res.status(500).json({
          message: "Not submit!",
        });
      }
    }
  );
};

//fetch particular partner

exports.fetchParticularPartner = async (req, res) => {
  try {
    const { userId } = req.body;

    const findPartnerQuery = "SELECT * FROM mining_partner WHERE p_userid = ?";
    connection.query(findPartnerQuery, [userId], (error, result) => {
      if (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Partner not found." });
      }

      return res
        .status(200)
        .json({ message: "Partner fetched successfully.", result });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//====================================================================

exports.fetchPartnerByReferralIdOfPartner = async (req, res) => {
  try {
    const { referralId } = req.body;

    const findPartnerQuery =
      "select * from mining_partner where p_reffered_id = ?";

    connection.query(findPartnerQuery, [referralId], (error, result) => {
      if (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
      }

      return res
        .status(200)
        .json({ message: "Referred Partner fetched successfully", result });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchPartnerReferWithdrawl = async (req, res) => {
  try {
    const { userId } = req.body;

    const findPartnerReferWithdrawlQuery =
      "select * from partner_reffer_withdrawal where p_userid = ? ";
    connection.query(
      findPartnerReferWithdrawlQuery,
      [userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          return res.status(500).json({ message: "Internal server error" });
        }

        return res.status(200).json({
          message: "fetched partner withdrawl succcessfully ",
          result,
        });
      }
    );
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ message: "Internal server errro" });
  }
};

exports.transferPartnerWithdrawlToWithdrawlHistory = async (req, res) => {
  let partnerId = req.body;
  console.log(partnerId.id, "1291");
  let query = "select * from partner_reffer_withdrawal where id = ? ";
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
        [partner_wallet, request_date, approve_date, reffer_p_userid, p_userid],
        (err, results) => {
          try {
            if (!err) {
              let selectquery =
                "select p_email,p_phone from mining_partner where p_userid = ?";
              connection.query(selectquery, [p_userid], (err, results) => {
                try {
                  if (!err) {
                    partnerEmail = results[0]?.p_email;
                    partnerPhone = results[0]?.p_phone;
                    email(partnerEmail, { withdrawalAmount: partner_wallet });
                  } else {
                    console.error(err); // Add console error log here
                    return res.status(500).json({
                      message: "Something Went Wrong",
                    });
                  }
                } catch (error) {
                  console.error(error); // Add console error log here
                  return res.status(500).json(error);
                }
              });
              let deletequery =
                "delete from partner_reffer_withdrawal where id = ?";
              connection.query(deletequery, [id], (err, results) => {
                if (!err) {
                  return res.status(200).json({
                    message: " Partner Reffer Withdrwal Request Approved",
                  });
                } else {
                  console.error(err); // Add console error log here
                  return res.status(500).json({
                    message: "Something Went Wrong",
                  });
                }
              });
            } else {
              console.error(err); // Add console error log here
              return res.status(500).json({
                message: "Something Went Wrong",
              });
            }
          } catch (error) {
            console.error(error); // Add console error log here
            return res.status(500).json(error);
          }
        }
      );
    } else {
      console.error(err); // Add console error log here
      return res.status(500).json(err);
    }
  });
};

exports.fetchPartnerReferWithdrawlHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    const findPartnerReferWithdrawalHistoryQuery =
      "select * from partner_reffer_withdrawal_history where p_userid = ?";
    connection.query(
      findPartnerReferWithdrawalHistoryQuery,
      [userId],
      (error, result) => {
        if (error) {
          console.log(error.message);
          return res.status(500).json({ message: "Internal server error" });
        }

        return res.status(200).json({
          message: "Fetched partner withdrawal history successfully",
          result,
        });
      }
    );
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchPartnerAndMultipleRig = async (req, res) => {
  try {
    const { userId } = req.body;

    const [result1] = await connection
      .promise()
      .query("select * from mining_partner where p_userid =?", [userId]);

    // if (result1.length === 0) {
    //   return res.status(404).json({ message: "Partner data not found" });
    // }

    const [result2] = await connection
      .promise()
      .query("select * from multiple_rig_partner where userId =?", [userId]);
    // if (result2.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "Multiple RIG Partner data not found" });
    // }

    const results = result1.concat(result2);

    if (results.length === 0) {
      return res.status(404).json({ message: "data not found" });
    }
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.partnerFetchTransactionHistory = async (req, res) => {
  try {
    const { partnerId, currentDate } = req.body;

    if (!partnerId) {
      return res.status(400).json({ message: "Partner ID is required." });
    }

    let fetchTransactionQuery =
      "SELECT * FROM partner_payout WHERE partnerId = ?";
    let fetchSumQuery =
      "SELECT SUM(payableAmount) AS totalAmount FROM partner_payout WHERE partnerId = ?";
    let currentDateSumQuery =
      "SELECT SUM(payableAmount) AS currentDateSum FROM partner_payout WHERE partnerId = ? AND DATE(payoutDate) = ?";
    let currentMonthSumQuery =
      "SELECT SUM(payableAmount) AS currentMonthSum FROM partner_payout WHERE partnerId = ? AND MONTH(payoutDate) = MONTH(?)";

    const queryParams = [partnerId];

    if (currentDate) {
      fetchTransactionQuery += " AND DATE(payoutDate) = ?";
      queryParams.push(currentDate);
    }

    const [transactionHistory] = await connection
      .promise()
      .query(fetchTransactionQuery, queryParams);

    let currentDateSum = 0;
    let currentMonthSum = 0;
    let allTransactionSum = 0;

    if (currentDate) {
      const [currentDateSumResult] = await connection
        .promise()
        .query(currentDateSumQuery, [partnerId, currentDate]);
      currentDateSum = currentDateSumResult[0].currentDateSum || 0;
    }

    const [currentMonthSumResult] = await connection
      .promise()
      .query(currentMonthSumQuery, [partnerId, currentDate]);

    currentMonthSum = currentMonthSumResult[0].currentMonthSum || 0;

    const [allTransactionSumResult] = await connection
      .promise()
      .query(fetchSumQuery, [partnerId]);

    allTransactionSum = allTransactionSumResult[0].totalAmount || 0;

    return res.status(200).json({
      message: "Partner Payout fetched successfully",
      data:transactionHistory,
      TodaysPayout:  currentDateSum,
      MonthPayout:currentMonthSum,
      TotalPayout: allTransactionSum,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.fetchReferralPayoutForPartner = async (req, res) => {
  try {
    const { partnerId } = req.body;
    
    if (!partnerId ) {
      return res.status(400).json({ message: "partnerId and userType are required" });
    }

    const [result] = await connection
      .promise()
      .query("SELECT * FROM my_team WHERE userid = ? ", [
        partnerId,
      ]);

    // Check if data is found
    if (result.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Data found, return it
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.fetchReferralPayoutTransactionTotal = async (req,res) => {
   try {
    const { userid, currentDate } = req.body;

    if (!userid) {
      return res.status(400).json({ message: "User ID is required." });
    }

    let fetchTransactionQuery =
      "SELECT * FROM my_team WHERE userid = ?";
    let fetchSumQuery =
      "SELECT SUM(amount) AS totalAmount FROM my_team WHERE userid = ?";
    let currentDateSumQuery =
      "SELECT SUM(amount) AS currentDateSum FROM my_team WHERE userid = ? AND DATE(credit_date) = ?";
    let currentMonthSumQuery =
      "SELECT SUM(amount) AS currentMonthSum FROM my_team WHERE userid = ? AND MONTH(credit_date) = MONTH(?)";

    const queryParams = [userid];

    if (currentDate) {
      fetchTransactionQuery += " AND DATE(credit_date) = ?";
      queryParams.push(currentDate);
    }

    const [transactionHistory] = await connection
      .promise()
      .query(fetchTransactionQuery, queryParams);

    let currentDateSum = 0;
    let currentMonthSum = 0;
    let allTransactionSum = 0;

    if (currentDate) {
      const [currentDateSumResult] = await connection
        .promise()
        .query(currentDateSumQuery, [userid, currentDate]);
      currentDateSum = currentDateSumResult[0].currentDateSum || 0;
    }

    const [currentMonthSumResult] = await connection
      .promise()
      .query(currentMonthSumQuery, [userid, currentDate]);

    currentMonthSum = currentMonthSumResult[0].currentMonthSum || 0;

    const [allTransactionSumResult] = await connection
      .promise()
      .query(fetchSumQuery, [userid]);

    allTransactionSum = allTransactionSumResult[0].totalAmount || 0;

    return res.status(200).json({
      message: "Partner Payout fetched successfully",
      TodaysPayout:  currentDateSum,
      MonthPayout:currentMonthSum,
      TotalPayout: allTransactionSum,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

exports.myPayoutCount = async (req, res) => {
  try {
    const { rigId } = req.body;

    if (!rigId) {
      return res.status(400).json({ message: "Rig ID is required." });
    }

    // Extract last three digits of rigId
    // const lastThreeDigits = rigId.substring(Math.max(0, rigId.length - 3));

    // Fetch partner payouts for a specific rigId based on last three digits
    const [partnerPayouts] = await connection
      .promise()
      .query("SELECT * FROM partner_payout WHERE SUBSTRING(rigId, -3) = ?", [rigId]);

    return res.status(200).json({
      message: "My Payout count fetched successfully",
      data: partnerPayouts,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};



