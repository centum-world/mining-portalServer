const sms = require("../utils/successfull-add-sms");
require("dotenv").config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const connection = require("../config/database");
const bcrypt = require("bcrypt");

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
    m_designation,
    m_quali,
    m_gender,
    m_exp,
    m_salary,
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
      "SELECT * FROM create_bd WHERE referralId = ? ";

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
        if (!isValidEmail(m_email)) {
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

        // Hash the password
        bcrypt.hash(m_password, 10, function (err, result) {
          if (err) {
            return res.status(500).json({ message: "Internal server error" });
          }
          const hash = result;

          // Insert member data into the database
          const insertQuery =
            "INSERT INTO create_member (m_name, m_lname, m_phone, m_add, m_refferid, m_state, m_email, m_designation, m_quali, m_gender, m_exp, m_salary, m_dob, m_doj, m_userid, m_password, reffer_id, adhar_front_side, adhar_back_side, panCard) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

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
              m_designation,
              m_quali,
              m_gender,
              m_exp,
              m_salary,
              m_dob,
              m_doj,
              m_userid,
              hash,
              "",
              adharFrontSideLocation,
              adharBackSideLocation,
              panCardLocation,
            ],
            (err, results) => {
              if (err) {
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
              });
            }
          );
        });
      }
    );
  });
};

// Partner Signup

exports.partnerSignup = (req, res, next) => {
  // Destructure the required fields from req.body
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
    p_reffered_id
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

  const adharFrontSideFile = req.files["adhar_front_side"][0];
  const adharBackSideFile = req.files["adhar_back_side"][0];
  const panCardFile = req.files["panCard"][0];

  const adharFrontSideLocation = adharFrontSideFile.location;
  const adharBackSideLocation = adharBackSideFile.location;
  const panCardLocation = panCardFile.location;

  // Validate partner data
  if (
    !p_name ||
    !p_lname ||
    !p_aadhar ||
    !p_phone ||
    !p_email ||
    !p_address ||
    !p_state ||
    !p_dob ||
    !p_nominee_name ||
    !p_nominee_aadhar ||
    !p_nominee_phone ||
    !p_dop ||
    !p_liquidity ||
    !terms ||
    !p_userid ||
    !p_password
  ) {
    return res.status(422).json({
      message: "Please fill in all required fields.",
    });
  }

  // You can add more specific validations for each field if needed.

  //check referral id is valid or not

  const isValidReferredIdQuery = "SELECT * FROM create_member WHERE reffer_id = ?";

  connection.query(isValidReferredIdQuery, [p_reffered_id], (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  
    if (result.length === 0) {
    const  isThisPartnerRefferedId = "SELECT * FROM mining_partner where p_refferal_id = ? ";
      connection.query(isThisPartnerRefferedId,[p_reffered_id],(err,result) => {
        if(err){
          return res.status(500).json({ message: "Internal server error" });
        }
        if(result.length ===0){
          const isThisAdminRefferedId = "SELECT * FROM admin_login where reffer_id = ?";
          connection.query(isThisAdminRefferedId,[p_reffered_id],(err,result) => {
            if(err){
              return res.status(500).json({message:"Internal server error"});
            }
            if(result.length === 0) {
              return res.status(400).json({message:"Invalid reffered ID"})
            }
          })
        }
      })

    } else {
      return res.status(200).json({ message: "Valid referred ID" });
    }
  });
  

  // Check if user ID already exists
  const checkUserIdExistQuery = "SELECT * FROM mining_partner WHERE p_userid = ?";

  connection.query(checkUserIdExistQuery, [p_userid], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Partner ID already exists" });
    }

    // Generate a unique partner referral ID based on the name
    const firstCharf = p_name.charAt(0).toUpperCase();
    const firstCharl = p_lname.charAt(0).toUpperCase();
    const p_refferal_id = firstCharf + firstCharl + Math.floor(Math.random() * 10000).toString();

    // Hash the password
    bcrypt.hash(p_password, 10, function (err, hash) {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }

      // Insert partner data into the database
      const insertQuery =
        "INSERT INTO mining_partner (p_reffered_id, p_name, p_lname, p_aadhar, p_phone, p_email, p_address, p_state, p_dob, p_nominee_name, p_nominee_aadhar, p_nominee_phone, p_dop, p_liquidity, terms, p_userid, p_password, p_refferal_id, adhar_front_side, adhar_back_side, panCard) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

      connection.query(
        insertQuery,
        [
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
          hash,
          p_refferal_id,
          adharFrontSideLocation,
          adharBackSideLocation,
          panCardLocation,
        ],
        (err, results) => {
          if (err) {
            return res.status(500).json({ message: "Internal server error" });
          }

          // Send an SMS with user details
          let password = p_password;
          sms(p_phone, {
            type: "Partner",
            userid: p_userid,
            password: password,
          });

          return res.status(200).json({
            message: "Mining partner added successfully",
          });
        }
      );
    });
  });
};

// Function to generate a unique number
// function generateUniqueNumber() {
//   // Implement your logic to generate a unique number, e.g., timestamp, random number, etc.
//   return Math.floor(Math.random() * 10000).toString();
// }


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
    "email",
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
    if (!isValidEmail(email)) {
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
          "State handler Id should have at least 1 letter and 1 digit, minimum length 6.",
      });
    }

    // Generate referralId
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const firstThreeDigits = `${fname.substring(0, 3).toUpperCase()}`;
    const referralId = "SH" + "-" + firstThreeDigits + randomDigits;

    // Check if stateHandlerId already exists
    const checkStateHandlerQuery =
      "SELECT stateHandlerId FROM create_sho WHERE stateHandlerId = ?";
    const existingStateHandler = await queryAsync(checkStateHandlerQuery, [
      stateHandlerId,
    ]);

    if (existingStateHandler.length > 0) {
      return res.status(400).json({
        message: "State Handler Id already exists. Please choose a unique ID.",
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
    "email",
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
