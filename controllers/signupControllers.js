
const sms = require('../utils/successfull-add-sms');
require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require("twilio")(accountSid, authToken);
const connection = require('../config/database');
const bcrypt = require('bcrypt');


// member Signup

exports.memberSignup = (req, res, next) => {
    let member = req.body;
    let selectquery = "select * from create_member where m_userid =?";
    connection.query(selectquery, [member.m_userid], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                let password = member.m_password;

                bcrypt.hash(member.m_password, 10, function (err, result) {
                    if (err) {
                        throw (err);
                    }
                    hash = result;


                    let query = "insert into create_member (m_name, m_phone, m_add, m_refferid, m_state, m_email, m_designation, m_quali, m_gender, m_exp, m_salary,m_dob, m_doj , m_userid, m_password, reffer_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    connection.query(query, [member.m_name, member.m_phone, member.m_add,
                    member.m_refferid, member.m_state, member.m_email, member.m_designation,
                    member.m_quali, member.m_gender, member.m_exp,
                    member.m_salary, member.m_dob, member.m_doj, member.m_userid,
                        hash, member.reffer_id], (err, results) => {
                            if (!err) {


                                sms(member.m_phone, { "type": 'Member', "userid": member.m_userid, "password": password })


                                return res.status(200).json({
                                    message: "member added successfully"
                                });
                            } else {
                                return res.status(500).json(err);
                            }
                        });
                })



            } else {
                return res.status(400).json({
                    message: "Member ID already exist!"
                })
            }
        } else {
            return res.status(500).json(err);
        }
    });

}

// Partner Signup

exports.partnerSignup = (req, res, next) => {
    let partner = req.body;
    let selectquery = "select * from mining_partner where p_userid = ?";
    connection.query(selectquery, [partner.p_userid], (err, results) => {
        if (!err) {
            if (results.length <= 0) {

                let password = partner.p_password;

                bcrypt.hash(partner.p_password, 10, function (err, result) {
                    if (err) {
                        throw (err);
                    }
                    hash = result;

                    let query = "insert into mining_partner(p_reffered_id ,p_name ,p_aadhar,p_phone,p_email,p_address,p_state,p_dob,p_nominee_name,p_nominee_aadhar,p_nominee_phone,p_dop,p_liquidity, terms,p_userid,p_password, p_refferal_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    connection.query(query, [partner.p_reffered_id, partner.p_name, partner.p_aadhar,
                    partner.p_phone, partner.p_email, partner.p_address, partner.p_state, partner.p_dob, partner.p_nominee_name,
                    partner.p_nominee_aadhar, partner.p_nominee_phone, partner.p_dop, partner.p_liquidity,
                    partner.terms, partner.p_userid, hash, partner.p_refferal_id], (err, results) => {
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