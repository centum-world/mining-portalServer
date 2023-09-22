
const sms = require('../utils/successfull-add-sms');
require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require("twilio")(accountSid, authToken);
const connection = require('../config/database');
const bcrypt = require('bcrypt');

const {queryAsync} = require('../utils/utility')


// member Signup

exports.memberSignup = (req, res, next) => {
    let member = req.body;
    let firstname = req.body.m_name;
    let lastname = req.body.m_lname;
    let reffer_id = '';
    const firstCharf = firstname.charAt(0).toUpperCase();
    const firstCharl = lastname.charAt(0).toUpperCase();

    let selectRefferid = " select reffer_id from create_member";
    connection.query(selectRefferid, (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                reffer_id = firstCharf + '' + firstCharl + '' + 9001;
                let query = "select * from create_member where m_userid = ?";
                connection.query(query, [member.m_userid], (err, results) => {

                    if (!err) {
                        if (results.length <= 0) {
                            let password = member.m_password;

                            bcrypt.hash(member.m_password, 10, function (err, result) {
                                if (err) {
                                    throw (err);
                                }
                                hash = result;
                                let query = "insert into create_member (m_name,m_lname, m_phone, m_add, m_refferid, m_state, m_email, m_designation, m_quali, m_gender, m_exp, m_salary,m_dob, m_doj , m_userid, m_password, reffer_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                                connection.query(query, [member.m_name, member.m_lname, member.m_phone, member.m_add,
                                member.m_refferid, member.m_state, member.m_email, member.m_designation,
                                member.m_quali, member.m_gender, member.m_exp,
                                member.m_salary, member.m_dob, member.m_doj, member.m_userid,
                                    hash, reffer_id], (err, results) => {
                                        if (!err) {


                                            sms(member.m_phone, { "type": 'Member', "userid": member.m_userid, "password": password })


                                            return res.status(200).json({
                                                message: "Member added successfully"
                                            });
                                        } else {
                                            return res.status(500).json(err);
                                        }
                                    });
                            });


                        } else {
                            return res.status(400).json({
                                message: "User ID already exist ! "
                            })
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
                reffer_id = firstCharf + '' + firstCharl + '' + (num + 1);
                let query = "select * from create_member where m_userid = ?";
                connection.query(query, [member.m_userid], (err, results) => {

                    if (!err) {
                        if (results.length <= 0) {
                            let password = member.m_password;

                            bcrypt.hash(member.m_password, 10, function (err, result) {
                                if (err) {
                                    throw (err);
                                }
                                hash = result;
                                let query = "insert into create_member (m_name,m_lname, m_phone, m_add, m_refferid, m_state, m_email, m_designation, m_quali, m_gender, m_exp, m_salary,m_dob, m_doj , m_userid, m_password, reffer_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                                connection.query(query, [member.m_name, member.m_lname, member.m_phone, member.m_add,
                                member.m_refferid, member.m_state, member.m_email, member.m_designation,
                                member.m_quali, member.m_gender, member.m_exp,
                                member.m_salary, member.m_dob, member.m_doj, member.m_userid,
                                    hash,reffer_id], (err, results) => {
                                        if (!err) {


                                            sms(member.m_phone, { "type": 'Member', "userid": member.m_userid, "password": password })


                                            return res.status(200).json({
                                                message: "Member added successfully"
                                            });
                                        } else {
                                            return res.status(500).json(err);
                                        }
                                    });
                            });


                        } else {
                            return res.status(400).json({
                                message: "User ID already exist ! "
                            })
                        }
                    } else {
                        return res.status(500).json(err);
                    }
                });
            }
        }
    });
    // let selectquery = "select * from create_member where m_userid =?";
    // connection.query(selectquery, [member.m_userid], (err, results) => {
    //     if (!err) {
    //         if (results.length <= 0) {
    //             let password = member.m_password;

    //             bcrypt.hash(member.m_password, 10, function (err, result) {
    //                 if (err) {
    //                     throw (err);
    //                 }
    //                 hash = result;


    //                 let query = "insert into create_member (m_name,m_lname, m_phone, m_add, m_refferid, m_state, m_email, m_designation, m_quali, m_gender, m_exp, m_salary,m_dob, m_doj , m_userid, m_password, reffer_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    //                 connection.query(query, [member.m_name,member.m_lname, member.m_phone, member.m_add,
    //                 member.m_refferid, member.m_state, member.m_email, member.m_designation,
    //                 member.m_quali, member.m_gender, member.m_exp,
    //                 member.m_salary, member.m_dob, member.m_doj, member.m_userid,
    //                     hash, member.reffer_id], (err, results) => {
    //                         if (!err) {


    //                             sms(member.m_phone, { "type": 'Member', "userid": member.m_userid, "password": password })


    //                             return res.status(200).json({
    //                                 message: "member added successfully"
    //                             });
    //                         } else {
    //                             return res.status(500).json(err);
    //                         }
    //                     });
    //             })



    //         } else {
    //             return res.status(400).json({
    //                 message: "Member ID already exist!"
    //             })
    //         }
    //     } else {
    //         return res.status(500).json(err);
    //     }
    // });

}

// Partner Signup

exports.partnerSignup = (req, res, next) => {
    let partner = req.body;
    let firstname = req.body.p_name;
    let lastname = req.body.p_lname;
    const firstCharf = firstname.charAt(0).toUpperCase();
    const firstCharl = lastname.charAt(0).toUpperCase();
    let p_refferal_id = '';
    if(!partner.p_reffered_id || !partner.p_name || !partner.p_lname || !partner.p_aadhar || !partner.p_phone || !partner.p_email || !partner.p_address || !partner.p_state || ! partner.p_dob || !partner.p_nominee_name 
        || !partner.p_nominee_aadhar || !partner.p_nominee_phone || !partner.p_dop || !partner.p_liquidity || !partner.terms || !partner.p_userid || !partner.p_password || !partner.p_refferal_id){
            return res.status(422).json({
                message:"Please Fill all Details"
            });
        }

        let selectrefferid = "select p_refferal_id from mining_partner ";
        connection.query(selectrefferid, (err, results) => {
            if (!err) {
                if (results.length <= 0) {
                    p_refferal_id = firstCharf + '' + firstCharl + '' + 9050;
                    console.log(p_refferal_id, '123');
                    let selectquery = " select * from mining_partner where p_userid = ?";
                    connection.query(selectquery, [partner.p_userid], (err, results) => {
    
                        if (!err) {
                            if (results.length <= 0) {
    
                                let password = partner.p_password;
    
                                bcrypt.hash(partner.p_password, 10, function (err, result) {
                                    if (err) {
                                        throw (err);
                                    }
                                    hash = result;
                                    let query = "insert into mining_partner(p_reffered_id ,p_name,p_lname ,p_aadhar,p_phone,p_email,p_address,p_state,p_dob,p_nominee_name,p_nominee_aadhar,p_nominee_phone,p_dop,p_liquidity, terms,p_userid,p_password, p_refferal_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                                    connection.query(query, [partner.p_reffered_id, partner.p_name, partner.p_lname, partner.p_aadhar,
                                    partner.p_phone, partner.p_email, partner.p_address, partner.p_state, partner.p_dob, partner.p_nominee_name,
                                    partner.p_nominee_aadhar, partner.p_nominee_phone, partner.p_dop, partner.p_liquidity,
                                    partner.terms, partner.p_userid, hash, p_refferal_id], (err, results) => {
                                        if (!err) {
    
                                            sms(partner.p_phone, { "type": 'Partner', "userid": partner.p_userid, "password": password })
                                            return res.status(200).json({
                                                message: "mining partner added successfully"
                                            });
                                        } else {
                                            return res.status(500).json(err);
                                        }
                                    });
    
                                })
    
    
                            } else {
                                return res.status(400).json({
                                    message: "Partner ID already exist!"
                                })
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
                    p_refferal_id = firstCharf + '' + firstCharl + '' + (num+1);
                    let selectquery = " select * from mining_partner where p_userid = ?";
                    connection.query(selectquery, [partner.p_userid], (err, results) => {
                
                        if (!err) {
                            if (results.length <= 0) {
                
                                let password = partner.p_password;
                
                                bcrypt.hash(partner.p_password, 10, function (err, result) {
                                    if (err) {
                                        throw (err);
                                    }
                                    hash = result;
                                    let query = "insert into mining_partner(p_reffered_id ,p_name,p_lname ,p_aadhar,p_phone,p_email,p_address,p_state,p_dob,p_nominee_name,p_nominee_aadhar,p_nominee_phone,p_dop,p_liquidity, terms,p_userid,p_password, p_refferal_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                                    connection.query(query, [partner.p_reffered_id, partner.p_name,partner.p_lname, partner.p_aadhar,
                                    partner.p_phone, partner.p_email, partner.p_address, partner.p_state, partner.p_dob, partner.p_nominee_name,
                                    partner.p_nominee_aadhar, partner.p_nominee_phone, partner.p_dop, partner.p_liquidity,
                                    partner.terms, partner.p_userid, hash,p_refferal_id], (err, results) => {
                                        if (!err) {
                
                                            sms(partner.p_phone, { "type": 'Partner', "userid": partner.p_userid, "password": password })
                                            return res.status(200).json({
                                                message: "mining partner added successfully"
                                            });
                                        } else {
                                            return res.status(500).json(err);
                                        }
                                    });
                
                                })
                
                
                            } else {
                                return res.status(400).json({
                                    message: "Partner ID already exist!"
                                })
                            }
                        } else {
                            return res.status(500).json(err);
                        }
                    });
    
                }
            }
        });
    // let selectquery = "select * from mining_partner where p_userid = ?";
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

    //                          sms(partner.p_phone, { "type": 'Partner', "userid": partner.p_userid, "password": password })
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

}

//create sho
exports.createSHO = async (req, res) => {
    const {
      fname,
      lname,
      phone,
      email,
      gender,
      password,
      stateHandlerId,
      selectedState,
      referredId,
    } = req.body;
  
    console.log("files", req.files["adharCard"]);
  
    // Check if any required fields are missing
    const requiredFields = [
      "fname",
      "lname",
      "email",
      "phone",
      "password",
      "gender",
      "stateHandlerId",
      "selectedState",
      "referredId"
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
  
    if(missingFields.length>0){
      return res.status(422).json({message: `Please fill all details: ${missingFields.join(", ")}`,
    })
    }
  
    try {
      //hash passowrd
  
      const hashedPassword = await bcrypt.hash(password, 10)
  
  
      // Check if stateHandlerId already exists
      const checkStateHandlerQuery =
        "SELECT stateHandlerId FROM create_SHO WHERE stateHandlerId = ?";
      const existingStateHandler = await queryAsync(checkStateHandlerQuery, [
        stateHandlerId,
      ]);
  
      if (existingStateHandler.length > 0) {
        return res.status(400).json({
          message: "State Handler Id already exists. Please choose a unique ID.",
        });
      }
  
      const adharCardFile = req.files["adharCard"][0];
      const panCardFile = req.files["panCard"][0]; // Get an array of PAN card files
  
      if (!adharCardFile|| adharCardFile.length === 0) {
        return res
          .status(400)
          .json({ message: "Aadhar card files are missing." });
      }
      if (!panCardFile || panCardFile.length === 0) {
        return res.status(400).json({ message: "PAN card files are missing." });
      }
  
       const adharCard = adharCardFile.location;
       const panCard = panCardFile.location;
  
       
   
  
      // Insert data into the database
      const insertStateHandlerQuery = `
      INSERT INTO create_SHO (fname, lname, phone, email, gender, password, stateHandlerId, selectedState, referredId, adharCard, panCard)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
      await queryAsync(insertStateHandlerQuery, [
        fname,
        lname,
        phone,
        email,
        gender,
        hashedPassword, // Use the hashed password here
        stateHandlerId,
        selectedState,
        referredId,
        adharCard,
        panCard,
      ]);
      return res.status(200).json({
        message: "State Handler created successfully",
        data: {
          fname,
          lname,
          phone,
          email,
          gender,
          stateHandlerId,
          selectedState,
          referredId,
          adharCard, // Store Aadhar card URL in response
          panCard,
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Database Error", error: error.message });
    }
  };