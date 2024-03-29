const sms = require("../utils/successfull-add-sms");
require("dotenv").config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const connection = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { queryAsync } = require("../utils/utility");

const {
  isValidImage,
  isValidEmail,
  isValidPhone,
  isValidName,
  isValidPassword,
  isValidUserId,
} = require("../utils/validation");

// member Signup

exports.memberSignup = (req, res, next) => {
  // Destructure the required fields from req.body
  const {
    m_name,
    m_lname,
    m_phone,
    m_add,
    m_refferid,
    m_state,
    m_email,
    // m_designation,
    // m_quali,
    m_gender,
    // m_exp,
    // m_salary,
    m_dob,
    m_doj,
    m_userid,
    m_password,
  } = req.body;

  // Check if required files are present
  if (!req.files["adhar_front_side"]) {
    return res
      .status(400)
      .json({ message: "Adhar card front side file is missing." });
  }

  if (!req.files["adhar_back_side"]) {
    return res
      .status(400)
      .json({ message: "Adhar card back side file is missing." });
  }

  if (!req.files["panCard"]) {
    return res.status(400).json({ message: "Pan card file is missing." });
  }

  // Get file locations
  const adharFrontSideFile = req.files["adhar_front_side"][0];
  const adharBackSideFile = req.files["adhar_back_side"][0];
  const panCardFile = req.files["panCard"][0];
  const adharFrontSideLocation = adharFrontSideFile.location;
  const adharBackSideLocation = adharBackSideFile.location;
  const panCardLocation = panCardFile.location;

  // Check if user ID already exists
  const checkUserIdExistQuery =
    "SELECT * FROM create_member WHERE m_userid = ?";

  connection.query(checkUserIdExistQuery, [m_userid], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    // Check if the referred ID is valid
    const isValidReferredIdQuery =
      "SELECT * FROM create_franchise WHERE referralId = ? ";

    connection.query(
      isValidReferredIdQuery,
      [m_refferid],
      (error, referredResults) => {
        if (error) {
          return res.status(500).json({ message: "Internal server error" });
        }

        if (referredResults.length === 0) {
          return res.status(400).json({ message: "Invalid referred ID" });
        }

        // Check name validity
        if (!isValidName(m_name)) {
          return res.status(422).json({
            message: "Invalid first name format.",
          });
        }

        if (!isValidName(m_lname)) {
          return res.status(422).json({
            message: "Invalid last name format.",
          });
        }

        // Check phone validity
        if (!isValidPhone(m_phone)) {
          return res.status(422).json({
            message:
              "Invalid phone number format. Use 10 digits or include a country code.",
          });
        }

        // Email validation
        if (m_email && !isValidEmail(m_email)) {
          return res.status(422).json({
            message: "Invalid email format.",
          });
        }

        // Password validation
        if (!isValidPassword(m_password)) {
          return res.status(422).json({
            message:
              "Password must be 8 to 15 characters long and contain at least one lowercase letter, one uppercase letter, and one digit.",
          });
        }

        const lastReferralIdQuery =
          "SELECT reffer_id FROM create_member ORDER BY id DESC LIMIT 1";

        connection.query(lastReferralIdQuery, (error, result) => {
          if (error) {
            console.log(error.message);
            return res.status(500).json({ message: "Internal server error" });
          }

          let lastReferralId = 9001; // Default starting point

          if (result.length > 0) {
            let findLastFourChar = result[0].reffer_id;
            let lastFourChars = findLastFourChar.slice(-4);
            const num = parseInt(lastFourChars);
            lastReferralId = num + 1;
          }

          const firstCharf = m_name.charAt(0).toUpperCase();
          const firstCharl = m_lname.charAt(0).toUpperCase();
          const reffer_id = firstCharf + firstCharl + lastReferralId;

          // Hash the password
          bcrypt.hash(m_password, 10, function (err, result) {
            if (err) {
              return res.status(500).json({ message: "Internal server error" });
            }
            const hash = result;
            const token = jwt.sign(
              { m_userid: m_userid, role: "member" },
              process.env.ACCESS_TOKEN,
              { expiresIn: 28800 }
            );

            const insertQuery =
              "INSERT INTO create_member (m_name, m_lname, m_phone, m_add, m_refferid, m_state, m_email, m_gender, m_dob, m_doj, m_userid, m_password, adhar_front_side, adhar_back_side, panCard,reffer_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

            connection.query(
              insertQuery,
              [
                m_name,
                m_lname,
                m_phone,
                m_add,
                m_refferid,
                m_state,
                m_email,
                // m_designation,
                // m_quali,
                m_gender,
                // m_exp,
                // m_salary,
                m_dob,
                m_doj,
                m_userid,
                hash,

                adharFrontSideLocation,
                adharBackSideLocation,
                panCardLocation,
                reffer_id,
              ],
              (err, results) => {
                if (err) {
                  console.log(err.message);
                  return res
                    .status(500)
                    .json({ message: "Internal server error" });
                }

                // Fetch the inserted member data
                const fetchMemberQuery =
                  "SELECT * FROM create_member WHERE m_userid = ?";

                connection.query(
                  fetchMemberQuery,
                  [m_userid],
                  (error, memberResult) => {
                    if (error) {
                      console.log(error.message);
                      return res
                        .status(500)
                        .json({ message: "Internal server error" });
                    }
                    if (memberResult.length === 0) {
                      return res
                        .status(500)
                        .json({ message: "Internal server error" });
                    }

                    // Send an SMS with user details
                    let password = m_password;
                    sms(m_phone, {
                      type: "Member",
                      userid: m_userid,
                      password: password,
                    });

                    return res.status(200).json({
                      message: "Member added successfully",
                      token,
                      data: memberResult[0],
                    });
                  }
                );
              }
            );
          });
        });
      }
    );
  });
};

exports.partnerSignup = async (req, res) => {
  try {
    const {
      p_name,
      p_lname,
      p_aadhar,
      p_phone,
      p_email,
      p_address,
      p_state,
      p_dob,
      p_nominee_name,
      p_nominee_aadhar,
      p_nominee_phone,
      p_dop,
      p_liquidity,
      terms,
      p_userid,
      p_password,
      p_reffered_id,
      role,
    } = req.body;
    console.log(p_phone, 244);

    // Check if required files are present
    if (
      !req.files["adhar_front_side"] ||
      !req.files["adhar_back_side"] ||
      !req.files["panCard"]
    ) {
      return res.status(400).json({ message: "Required files are missing." });
    }

    const adharFrontSideFile = req.files["adhar_front_side"][0];
    const adharBackSideFile = req.files["adhar_back_side"][0];
    const panCardFile = req.files["panCard"][0];

    const adharFrontSideLocation = adharFrontSideFile.location;
    const adharBackSideLocation = adharBackSideFile.location;
    const panCardLocation = panCardFile.location;

    const requiredFields = [
      "p_name",
      "p_lname",
      "p_aadhar",
      "p_phone",
      "p_address",
      "p_state",
      "p_dob",
      "p_nominee_name",
      "p_nominee_aadhar",
      "p_nominee_phone",
      "p_dop",
      "p_liquidity",
      "terms",
      "p_userid",
      "p_password",
      "p_reffered_id",
      "role",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(422).json({
        message: `Please fill all details: ${missingFields.join(", ")}`,
      });
    }

    // Check if user ID already exists
    const checkUserIdExistQuery =
      "SELECT p_userid FROM mining_partner WHERE p_userid = ?";

    const [result] = await connection
      .promise()
      .query(checkUserIdExistQuery, [p_userid]);

    if (result.length > 0) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    // Check if Phone already exists
    const checkPhoneExistQuery =
      "SELECT p_phone FROM mining_partner WHERE p_phone = ?";

    const [phoneResult] = await connection
      .promise()
      .query(checkPhoneExistQuery, [p_phone]);

    if (phoneResult.length > 0) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    if (!isValidName(p_name)) {
      return res.status(422).json({
        message: "Invalid first name format.",
      });
    }

    if (!isValidName(p_lname)) {
      return res.status(422).json({
        message: "Invalid last name format.",
      });
    }

    // Check phone validity
    if (!isValidPhone(p_phone)) {
      return res.status(422).json({
        message:
          "Invalid phone number format. Use 10 digits or include a country code.",
      });
    }

    // Email validation
    if (p_email &&!isValidEmail(p_email)) {
      return res.status(422).json({
        message: "Invalid email format.",
      });
    }

    // Password validation
    if (!isValidPassword(p_password)) {
      return res.status(422).json({
        message:
          "Password must be 8 to 15 characters long and contain at least one lowercase letter, one uppercase letter, and one digit.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(p_password, 10);

    // Role-based referral ID validation
    if (role === "BMM") {
      const validBmmReferralId =
        "select referralId from create_sho where referralId = ?";

      const [bmmResult] = await connection
        .promise()
        .query(validBmmReferralId, [p_reffered_id]);

      if (bmmResult.length === 0) {
        return res.status(400).json({ message: "Invalid referral ID of BMM" });
      }
    }

    if (role === "FRANCHISE") {
      const validFranchiseReferralId =
        "select referralId from create_franchise where referralId = ?";

      const [franchiseResult] = await connection
        .promise()
        .query(validFranchiseReferralId, [p_reffered_id]);

      if (franchiseResult.length === 0) {
        return res
          .status(400)
          .json({ message: "Invalid referral ID of franchise" });
      }
    }

    if (role === "MEMBER") {
      const validMemberReferralId =
        "select reffer_id from create_member where reffer_id = ?";

      const [memberResult] = await connection
        .promise()
        .query(validMemberReferralId, [p_reffered_id]);

      if (memberResult.length === 0) {
        return res
          .status(400)
          .json({ message: "Invalid referral ID of member" });
      }
    }

    if (role === "PARTNER") {
      const validPartnerReferralId =
        "select p_refferal_id from mining_partner where p_refferal_id = ?";

      const [partnerResult] = await connection
        .promise()
        .query(validPartnerReferralId, [p_reffered_id]);

      if (partnerResult.length === 0) {
        return res
          .status(400)
          .json({ message: "Invalid referral ID of member" });
      }
    }

    const lastReferralIdQuery =
      "SELECT p_refferal_id FROM mining_partner ORDER BY id DESC LIMIT 1";

    const [lastReferralResult] = await connection
      .promise()
      .query(lastReferralIdQuery);

    let lastReferralId = 9050; // Default starting point
    if (lastReferralResult.length > 0) {
      let findLastFourChar = lastReferralResult[0].p_refferal_id;
      let lastFourChars = findLastFourChar.slice(-4);
      const num = parseInt(lastFourChars);
      lastReferralId = num + 1;
    }

    // Generate automatic referral ID based on the last ID
    const firstCharf = p_name.charAt(0).toUpperCase();
    const firstCharl = p_lname.charAt(0).toUpperCase();
    const p_refferal_id = firstCharf + firstCharl + lastReferralId;

    const lastRigIdQuery =
      "SELECT rigId FROM mining_partner ORDER BY id DESC LIMIT 1";

    const [lastRigIdResult] = await connection.promise().query(lastRigIdQuery);

    let lastRigId = "0626";
    if (lastRigIdResult.length > 0) {
      lastRigId = lastRigIdResult[0].rigId.slice(-4);
      console.log(lastRigId, 413);
      const lastRigIdInNumber = Number(lastRigId);
      console.log(lastRigIdInNumber, 414);
      lastRigId = (lastRigIdInNumber + 1).toString().padStart(4, "0");
      console.log(lastRigId, 417);
    }

    const rigId = firstCharf + firstCharl + lastRigId;

 


    //creating token

    const token = jwt.sign(
      { p_userid: p_userid, role: "partner" },
      process.env.ACCESS_TOKEN,
      { expiresIn: 28800 }
    );

    // Insert partner data into the database

    const insertQuery = `
      INSERT INTO mining_partner 
      (p_refferal_id,p_reffered_id, p_name, p_lname, p_aadhar, p_phone, p_email, p_address, p_state, 
      p_dob, p_nominee_name, p_nominee_aadhar, p_nominee_phone, p_dop, p_liquidity, terms, 
      p_userid, p_password, adhar_front_side, adhar_back_side, panCard, rigId) 
      VALUES (?, ?, ?, ?, ?,?,  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection
      .promise()
      .query(insertQuery, [
        p_refferal_id,
        p_reffered_id,
        p_name,
        p_lname,
        p_aadhar,
        p_phone,
        p_email,
        p_address,
        p_state,
        p_dob,
        p_nominee_name,
        p_nominee_aadhar,
        p_nominee_phone,
        p_dop,
        p_liquidity,
        terms,
        p_userid,
        hashedPassword,
        adharFrontSideLocation,
        adharBackSideLocation,
        panCardLocation,
        rigId,
      ]);
   //fetched inserted document

   const fetchPartnerQuery =
   "SELECT * FROM mining_partner WHERE p_userid = ?";
 
   const [partnerResult] = await connection.promise().query(fetchPartnerQuery, [p_userid])
    res
      .status(200)
      .json({ message: "Partner data inserted successfully.", token , data: partnerResult[0]});
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

  if (!req.files["adhar_front_side"]) {
    return res
      .status(400)
      .json({ message: "Adhar card front side file is missing." });
  }

  if (!req.files["adhar_back_side"]) {
    return res
      .status(400)
      .json({ message: "Adhar card back side file is missing." });
  }

  if (!req.files["panCard"]) {
    return res.status(400).json({ message: "Pan card file is missing." });
  }

  const adharFrontSideFile = req.files["adhar_front_side"][0];
  const adharBackSideFile = req.files["adhar_back_side"][0];

  const panCardFile = req.files["panCard"][0];

  const adharFrontSideLocation = adharFrontSideFile.location;
  const adharBackSideLocation = adharBackSideFile.location;

  const panCardLocation = panCardFile.location;

  // Check if any required fields are missing
  const requiredFields = [
    "fname",
    "lname",
    "phone",
    "password",
    "gender",
    "stateHandlerId",
    "selectedState",
    "referredId",
  ];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(422).json({
      message: `Please fill all details: ${missingFields.join(", ")}`,
    });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check name validity
    if (!isValidName(fname)) {
      return res.status(422).json({
        message: "Invalid first name format.",
      });
    }

    if (!isValidName(lname)) {
      return res.status(422).json({
        message: "Invalid last name format.",
      });
    }

    // Check phone validity
    if (!isValidPhone(phone)) {
      return res.status(422).json({
        message:
          "Invalid phone number format. Use 10 digits or include a country code.",
      });
    }

    // Email validation
    if (email && !isValidEmail(email)) {
      return res.status(422).json({
        message: "Invalid email format.",
      });
    }

    // Password validation
    if (!isValidPassword(password)) {
      return res.status(422).json({
        message:
          "Password must be 8 to 15 characters long and contain at least one lowercase letter, one uppercase letter, and one digit.",
      });
    }

    // State Handler ID validation
    if (!isValidUserId(stateHandlerId)) {
      return res.status(422).json({
        message:
          "User Id should have at least 1 letter and 1 digit, minimum length 6.",
      });
    }

    // Generate referralId
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const firstThreeDigits = `${fname.substring(0, 3).toUpperCase()}`;
    const referralId = "BMM" + "-" + firstThreeDigits + randomDigits;

    // Check if stateHandlerId already exists
    const checkStateHandlerQuery =
      "SELECT stateHandlerId FROM create_sho WHERE stateHandlerId = ?";
    const existingStateHandler = await queryAsync(checkStateHandlerQuery, [
      stateHandlerId,
    ]);

    if (existingStateHandler.length > 0) {
      return res.status(400).json({
        message: "User Id already exists. Please choose a unique ID.",
      });
    }

    if (referredId) {
      const checkReferredIdQuery =
        "SELECT reffer_id FROM admin_login WHERE reffer_id = ?";
      const referredAdmin = await queryAsync(checkReferredIdQuery, [
        referredId,
      ]);

      if (referredAdmin.length === 0) {
        return res.status(400).json({
          message:
            "Invalid referred Id. You are providing invalid referral Id.",
        });
      }
    }

    //token create

    const token = jwt.sign(
      { s_userid: stateHandlerId, role: "state" },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: 28800,
      }
    );

    // Insert data into the database
    const insertStateHandlerQuery = `
      INSERT INTO create_sho (fname, lname, phone, email, gender, password, stateHandlerId, selectedState, referredId, adhar_front_side, adhar_back_side, panCard, referralId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await queryAsync(insertStateHandlerQuery, [
      fname,
      lname,
      phone,
      email,
      gender,
      hashedPassword,
      stateHandlerId,
      JSON.stringify(selectedState), // Convert the array to a JSON string

      referredId,
      adharFrontSideLocation,
      adharBackSideLocation,
      panCardLocation,
      referralId,
    ]);

    return res.status(200).json({
      message: "BMM registered successfully",
      data: {
        token,
        fname,
        lname,
        phone,
        email,
        gender,
        stateHandlerId,
        selectedState,
        referredId,
        adhar_front_side: adharFrontSideLocation,
        adhar_back_side: adharBackSideLocation,
        panCard: panCardLocation,
        referralId,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

//create franchise
exports.createFranchise = async (req, res) => {
  const {
    fname,
    lname,
    phone,
    email,
    gender,
    password,
    franchiseId,
    franchiseState,
    franchiseCity,
    referredId,
  } = req.body;

  if (!req.files["adhar_front_side"]) {
    return res
      .status(400)
      .json({ message: "Adhar card front side file is missing." });
  }

  if (!req.files["adhar_back_side"]) {
    return res
      .status(400)
      .json({ message: "Adhar card back side file is missing." });
  }

  if (!req.files["panCard"]) {
    return res.status(400).json({ message: "Pan card file is missing." });
  }

  const adharFrontSideFile = req.files["adhar_front_side"][0];
  const adharBackSideFile = req.files["adhar_back_side"][0];

  const panCardFile = req.files["panCard"][0];

  const adharFrontSideLocation = adharFrontSideFile.location;
  const adharBackSideLocation = adharBackSideFile.location;

  const panCardLocation = panCardFile.location;

  // Check if any required fields are missing
  const requiredFields = [
    "fname",
    "lname",
    "phone",
    "password",
    "gender",
    "franchiseId",
    "franchiseCity",
    "franchiseState",
    "referredId",
  ];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(422).json({
      message: `Please fill all details: ${missingFields.join(", ")}`,
    });
  }

  try {
    //hash passowrd

    const hashedPassword = await bcrypt.hash(password, 10);

    //check name is valid or not

    if (!isValidName(fname)) {
      return res.status(422).json({
        message: "Invalid first name format.",
      });
    }

    if (!isValidName(lname)) {
      return res.status(422).json({
        message: "Invalid last name format.",
      });
    }

    //check phone is valid or not

    if (!isValidPhone(phone)) {
      return res.status(422).json({
        message:
          "Invalid phone number format. Use 10 digits or include country code.",
      });
    }
    //email validation
    if (email && !isValidEmail(email)) {
      return res.status(422).json({
        message: "Invalid email format.",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(422).json({
        message:
          "Password must be 8 to 15 characters long and contain at least one lowercase letter, one uppercase letter, and one digit.",
      });
    }

    if (!isValidUserId(franchiseId)) {
      return res.status(422).json({
        message:
          "frenchise Id Should have at least 1 letter and 1 digit, minimum length 6.",
      });
    }

    //check referredId is valid or not

    const checkReferredIdQuery =
      "SELECT referralId from create_sho WHERE referralId = ?";
    const existingReferredId = await queryAsync(checkReferredIdQuery, [
      referredId,
    ]);
    if (existingReferredId.length === 0) {
      return res.status(400).json({
        message: "Invalid referredId. Please provide a valid referral Id.",
      });
    }

    //generate referralId

    const randomDigits = Math.floor(1000 + Math.random() * 9000);

    const firstThreeDigits = `${fname.substring(0, 3).toUpperCase()}`;
    const referralId = "FC" + "-" + firstThreeDigits + randomDigits;

    // Check if franchiseId already exists
    const checkFranchiseQuery =
      "SELECT franchiseId FROM create_franchise WHERE franchiseId = ?";
    const existingFranchise = await queryAsync(checkFranchiseQuery, [
      franchiseId,
    ]);

    if (existingFranchise.length > 0) {
      return res.status(400).json({
        message: "Franchise Id already exists. Please choose a unique ID.",
      });
    }

    if (referredId) {
      const checkReferredIdQuery =
        "SELECT referralId FROM create_sho WHERE referralId = ?";
      const referralSho = await queryAsync(checkReferredIdQuery, [referredId]);

      if (referralSho.length === 0) {
        return res.status(400).json({
          message: "You are providing invalid referred Id.",
        });
      }
    }

    const token = jwt.sign(
      { f_userid: franchiseId, role: "franchise" },
      process.env.ACCESS_TOKEN,
      { expiresIn: 28800 }
    );

    // Insert data into the database
    const insertStateHandlerQuery = `
        INSERT INTO create_franchise (fname, lname, phone, email, gender, password, franchiseId, franchiseState, franchiseCity,referredId, adhar_front_side,adhar_back_side, panCard, referralId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?,?, ?)
      `;

    await queryAsync(insertStateHandlerQuery, [
      fname,
      lname,
      phone,
      email,
      gender,
      hashedPassword, // Use the hashed password here
      franchiseId,
      franchiseState,
      franchiseCity,
      referredId,
      adharFrontSideLocation,
      adharBackSideLocation,
      panCardLocation,
      referralId,
    ]);
    return res.status(200).json({
      message: "Franchise created successfully",
      data: {
        token,
        fname,
        lname,
        phone,
        email,
        gender,
        franchiseId,
        franchiseState,
        franchiseCity,
        referredId,
        adhar_front_side: adharFrontSideLocation, // Store Aadhar card URL in response
        adhar_back_side: adharBackSideLocation,
        panCard: panCardLocation,
        referralId,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

//create business developer

exports.createBd = async (req, res) => {
  try {
    const {
      fname,
      lname,
      phone,
      email,
      gender,
      password,
      businessDeveloperId,
      referredId,
      businessCity,
      state,
    } = req.body;

    // Check for missing files
    if (!req.files["adhar_front_side"]) {
      return res
        .status(400)
        .json({ message: "Adhar card front side file is missing." });
    }

    if (!req.files["adhar_back_side"]) {
      return res
        .status(400)
        .json({ message: "Adhar card back side file is missing." });
    }

    if (!req.files["panCard"]) {
      return res.status(400).json({ message: "Pan card file is missing." });
    }

    const adharCardBackFile = req.files["adhar_back_side"][0];
    const adharCardFrontFile = req.files["adhar_front_side"][0];
    const panCardFile = req.files["panCard"][0];

    // Check if adharCard image is valid using isValidImage function
    if (
      !isValidImage(adharCardBackFile.originalname) ||
      !isValidImage(adharCardFrontFile.originalname) ||
      !isValidImage(panCardFile.originalname)
    ) {
      return res.status(422).json({
        message:
          "Invalid image format. Images must be in jpeg, jpg, tiff, png, webp, or bmp format.",
      });
    }

    const adharBackLocation = adharCardBackFile.location;
    const adharFrontLocation = adharCardFrontFile.location;
    const panCardLocation = panCardFile.location;

    const requiredFields = [
      "fname",
      "lname",
      "email",
      "phone",
      "password",
      "businessDeveloperId",
      "referredId",
      "businessCity",
      "gender",
      "state",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(422).json({
        message: `Please fill all details: ${missingFields.join(", ")}`,
      });
    }

    // Validate businessDeveloperId uniqueness
    const checkBusinessDeveloperQuery =
      "SELECT businessDeveloperId FROM create_bd WHERE businessDeveloperId = ?";
    const existingBusinessDeveloper = await queryAsync(
      checkBusinessDeveloperQuery,
      [businessDeveloperId]
    );

    if (existingBusinessDeveloper.length > 0) {
      return res.status(422).json({
        message:
          "This Business Developer ID already exists. Please choose a unique ID.",
      });
    }

    // Check if referredId exists in your Frenchise table
    const checkReferredIdQuery =
      "SELECT referralId FROM create_franchise WHERE referralId = ?";
    const existingReferredId = await queryAsync(checkReferredIdQuery, [
      referredId,
    ]);

    if (existingReferredId.length === 0) {
      return res.status(400).json({
        message: "Invalid referredId. Please provide a valid referral Id.",
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(422).json({
        message:
          "Invalid phone number format. Use 10 digits or include country code.",
      });
    }

    if (!isValidName(fname) || !isValidName(lname)) {
      return res.status(422).json({
        message: "Invalid name format.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(422).json({
        message: "Invalid email format.",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(422).json({
        message:
          "Password must be 8 to 15 characters long and contain at least one lowercase letter, one uppercase letter, and one digit.",
      });
    }

    if (!isValidUserId(businessDeveloperId)) {
      return res.status(422).json({
        message:
          "Business Developer Id Should have at least 1 letter and 1 digit, minimum length 6.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const firstThreeDigits = `${fname.substring(0, 3).toUpperCase()}`;
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const referralId = "BD" + "-" + firstThreeDigits + randomDigits;

    // Insert data into the database
    const insertBusinessDeveloperQuery = `
        INSERT INTO create_bd (fname, lname, phone, email, gender, password, businessDeveloperId, adhar_back_side, adhar_front_side, panCard, referralId, referredId, businessCity, state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

    await queryAsync(insertBusinessDeveloperQuery, [
      fname,
      lname,
      phone,
      email,
      gender,
      hashedPassword,
      businessDeveloperId,
      adharBackLocation,
      adharFrontLocation,
      panCardLocation,
      referralId,
      referredId,
      businessCity,
      state,
    ]);

    return res.status(201).json({
      message: "Business Developer created successfully",
      data: {
        fname,
        lname,
        phone,
        email,
        gender,
        businessDeveloperId,
        adhar_back_side: adharBackLocation,
        adhar_front_side: adharFrontLocation,
        panCard: panCardLocation,
        referralId,
        referredId,
        businessCity,
        state,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createMultipleRig = async (req, res) => {
  try {
    const { fname, lname, dob, userId, liquidity, adharNumber, phone } =
      req.body;

    // Check if the userId has reached the limit of 9 accounts
    const userIdLimitQuery =
      "SELECT COUNT(*) as count FROM multiple_rig_partner WHERE userId = ?";

    const [userIdLimitResult] = await connection
      .promise()
      .query(userIdLimitQuery, [userId]);

    const accountCount = userIdLimitResult[0].count;

    if (accountCount >= 9) {
      return res.status(400).json({
        message:
          "You cannot create more than 10 accounts with the same userId.",
      });
    }

    if (fname && lname && dob && userId && liquidity && adharNumber && phone) {
      console.log("2nd cndition");
      const { adhar_front_side, adhar_back_side, panCard } = req.files;

      const partnerQuery =
        "SELECT p_phone FROM mining_partner WHERE p_userid = ?";
      const [existingPartner] = await connection
        .promise()
        .query(partnerQuery, [userId]);

      const existingPhone = existingPartner[0].p_phone;
      console.log(existingPhone, 1053);

      console.log(phone, 1186);

      const withoutCountryCodePhone = phone.slice(-10);

      console.log(withoutCountryCodePhone, 1188);

      if (existingPhone != withoutCountryCodePhone) {
        return res.status(400).json({
          message:
            "!Mismatched phone number. Use the same as in partner registration.",
        });
      }
      // Check if required files are present
      if (!adhar_front_side || !adhar_back_side || !panCard) {
        return res.status(400).json({ message: "Required files are missing." });
      }

      const adharFrontSideFile = adhar_front_side[0];
      const adharBackSideFile = adhar_back_side[0];
      const panCardFile = panCard[0];

      const adharFrontSideLocation = adharFrontSideFile.location;
      const adharBackSideLocation = adharBackSideFile.location;
      const panCardLocation = panCardFile.location;

      // Find the last rigId from the mining_partner table
      const findRigIdQuery =
        "SELECT rigId FROM mining_partner ORDER BY id DESC LIMIT 1";
      const [findRigIdResult] = await connection
        .promise()
        .query(findRigIdQuery);

      // if i get findrigidResulr 0627 then rig id will be 1627 next 2627 next 3627
      const rigIdQuery =
        "SELECT rigId FROM multiple_rig_partner WHERE userId = ?";
      const [rigIdResult] = await connection
        .promise()
        .query(rigIdQuery, [userId]);

      let finalastFourCharRigId;

      if (rigIdResult.length > 0) {
        //when i am creating 2nd raw then go to this conditon

        let lastRigId = rigIdResult[rigIdResult.length - 1].rigId;

        console.log(lastRigId, 1090);
        const lastFourChars = lastRigId.slice(-4);

        const lastRigIdInNumber = Number(lastFourChars);

        lastRigId = lastRigIdInNumber.toString().padStart(4, "0");

        let firstCharRigId = lastRigId[0];
        let lastThreeCharRigId = lastRigId.slice(-3);
        firstCharRigId = String(Number(firstCharRigId) + 1);

        finalastFourCharRigId = firstCharRigId + lastThreeCharRigId;
      } else if (findRigIdResult.length > 0) {
        // when i am creating first raw in multplerig table then go to this condition
        let lastRigId = findRigIdResult[0].rigId;
        const lastFourChars = lastRigId.slice(-4);
        console.log(lastFourChars, 1083);

        const lastRigIdInNumber = Number(lastFourChars);
        console.log(lastRigIdInNumber, 1084); // 628

        lastRigId = lastRigIdInNumber.toString().padStart(4, "0"); // but i want here 1628

        console.log(lastRigId, 1090);
        let firstCharRigId = lastRigId[0];
        let lastThreeCharRigId = lastRigId.slice(-3);

        console.log(firstCharRigId, 1127);
        console.log(lastThreeCharRigId, 1128);

        firstCharRigId = Number(firstCharRigId) + 1;
        console.log(firstCharRigId, 1132);

        finalastFourCharRigId = firstCharRigId + lastThreeCharRigId;
        console.log(finalastFourCharRigId, 1135);
      }

      const firstCharf = fname.charAt(0).toUpperCase();
      const firstCharl = lname.charAt(0).toUpperCase();

      const rigId = firstCharf + firstCharl + finalastFourCharRigId;

      // Insert rig data into the database
      const insertQuery = `
        INSERT INTO multiple_rig_partner
        (rigId, fname, lname, dob,userId, adhar_front_side, adhar_back_side, panCard, liquidity , adharNumber) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        
        `;

      await connection.promise().query(insertQuery, [
        rigId,
        fname,
        lname,
        dob,
        // doj,
        userId,
        adharFrontSideLocation,
        adharBackSideLocation,
        panCardLocation,
        liquidity,
        adharNumber,
      ]);
    } else if (userId && liquidity) {
      console.log(" first condition");
      const [partnerResult] = await connection
        .promise()
        .query("select * from mining_partner where p_userid= ?", [userId]);

      const partner = partnerResult[0];

      let {
        p_name,
        p_lname,
        p_aadhar,
        adhar_front_side,
        adhar_back_side,
        panCard,
        rigId,
        p_dop,
      } = partner;

      console.log(rigId, 1062);

      console.log(adhar_back_side, 1054);

      const rigIdQuery =
        "SELECT rigId FROM multiple_rig_partner WHERE userId = ?";
      const [rigIdResult] = await connection
        .promise()
        .query(rigIdQuery, [userId]);

      // console.log(rigIdResult[rigIdResult.length - 1].rigId, 1062);

      let finalastFourCharRigId;

      if (rigIdResult.length > 0) {
        console.log(" 2nd raw - 3rd -4th... ");
        //when i am creating  2nd raw - 3rd -4th...  then go to this conditon
        let lastRigId = rigIdResult[rigIdResult.length - 1].rigId;
        console.log(lastRigId, 1071);
        const lastFourChars = lastRigId.slice(-4);

        const lastRigIdInNumber = Number(lastFourChars);

        lastRigId = lastRigIdInNumber.toString().padStart(4, "0");

        let firstCharRigId = lastRigId[0];
        let lastThreeCharRigId = lastRigId.slice(-3);
        firstCharRigId = String(Number(firstCharRigId) + 1);

        finalastFourCharRigId = firstCharRigId + lastThreeCharRigId;
        console.log(finalastFourCharRigId, 1083);
      } else if (partnerResult.length > 0) {
        // when i am creating first raw in multplerig table then go to this condition
        let lastRigId = partnerResult[0].rigId;
        const lastFourChars = lastRigId.slice(-4);
        console.log(lastFourChars, 1098);

        const lastRigIdInNumber = Number(lastFourChars);
        console.log(lastRigIdInNumber, 1101); // 628

        lastRigId = lastRigIdInNumber.toString().padStart(4, "0"); // but i want here 1628

        console.log(lastRigId, 1105);
        let firstCharRigId = lastRigId[0];
        let lastThreeCharRigId = lastRigId.slice(-3);

        console.log(firstCharRigId, 1109);
        console.log(lastThreeCharRigId, 1110);

        firstCharRigId = Number(firstCharRigId) + 1;
        console.log(firstCharRigId, 1113);

        finalastFourCharRigId = firstCharRigId + lastThreeCharRigId;
        console.log(finalastFourCharRigId, 1116);
      }

      const firstCharf = p_name.charAt(0).toUpperCase();
      const firstCharl = p_lname.charAt(0).toUpperCase();

      rigId = firstCharf + firstCharl + finalastFourCharRigId;

      console.log(rigId, 1126);

      const insertMultipleRigQuery = `insert into multiple_rig_partner (rigId, fname, lname, dob, userId, adhar_front_side, adhar_back_side,panCard, liquidity, adharNumber) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      await connection
        .promise()
        .query(insertMultipleRigQuery, [
          rigId,
          p_name,
          p_lname,
          p_dop,
          userId,
          adhar_front_side,
          adhar_back_side,
          panCard,
          liquidity,
          p_aadhar,
        ]);
    }

    res.status(200).json({ message: "New RIG Account created successfully." });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
