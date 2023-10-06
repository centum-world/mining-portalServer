const connection = require("../config/database");
const bcrypt = require("bcrypt");
const { queryAsync } = require("../utils/utility");
const jwt = require("jsonwebtoken");
const {
  isValidImage,
  isValidEmail,
  isValidPhone,
  isValidName,
  isValidPassword,
  isValidUserId,
} = require("../utils/validation");

exports.loginFranchise = async (req, res) => {
  try {
    const { userid, password } = req.body;

    // Check if required fields are missing
    if (!userid || !password) {
      return res
        .status(422)
        .json({ message: "Please provide Franchise  Id  and password." });
    }

    const findUserQuery = "SELECT * from create_franchise WHERE franchiseId=?";
    const [user] = await queryAsync(findUserQuery, [userid]);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid Franchise Id or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Invalid Franchise Id or password" });
    }

    const token = jwt.sign(
      { f_userid: user.franchiseId, role: "franchise" },
      process.env.ACCESS_TOKEN
    );

    return res.status(200).json({ message: "Login successfully", user, token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//fetch particular franchise

exports.fetchParticularFranchise = async (req, res) => {
  try {
    const { franchiseId } = req.body;

    if (!franchiseId) {
      return res.status(400).json({ message: "Franchise Id is required" });
    }

    const findFranchiseQuery =
      "SELECT * FROM create_franchise WHERE franchiseId = ?";

    const [franchise] = await queryAsync(findFranchiseQuery, [franchiseId]);

    if (!franchise) {
      return res.status(404).json({ message: "Franchise not found" });
    }
    return res
      .status(200)
      .json({ message: "Franchise details fetched successfully", franchise });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

//verify franchise

exports.verifyFranchise = async (req, res) => {
  try {
    const { franchiseId, isVerify } = req.body;

    if (typeof isVerify != "boolean") {
      return res.status(400).json({ message: "Invalid 'isVerify' value" });
    }

    const upadteFranchiseQuery =
      "UPDATE create_franchise SET isVerify =? WHERE franchiseId = ?";

    connection.query(
      upadteFranchiseQuery,
      [isVerify, franchiseId],
      (error, result) => {
        if (error) {
          console.error("Error updating franchises:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows == 0) {
          return res.status(200).json({ message: "franhcise not found" });
        }

        return res.status(200).json({ message: "Franchise verified" });
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update franchise

exports.updateFranchise = async (req, res) => {
  try {
    const {
      fname,
      lname,
      email,
      phone,
      gender,
      franchiseState,
      franchiseCity,
      franchiseId,
    } = req.body;

    const requiredFields = [
      "fname",
      "lname",
      "email",
      "phone",
      "gender",
      "franchiseState",
      "franchiseCity",
      "franchiseId",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(422).json({
        message: `Please fill all details: ${missingFields.join(", ")}`,
      });
    }

    // Check if name is valid
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

    // Check if phone is valid
    if (!isValidPhone(phone)) {
      return res.status(422).json({
        message:
          "Invalid phone number format. Use 10 digits or include a country code.",
      });
    }

    // Check if email is valid
    if (!isValidEmail(email)) {
      return res.status(422).json({
        message: "Invalid email format.",
      });
    }

    // Construct the SQL query to update the franchise
    const updateFranchiseQuery =
      "UPDATE create_franchise SET fname=?, lname=?, email=?, phone=?, gender=?, franchiseState=?, franchiseCity=? WHERE franchiseId=?";

    // Execute the SQL query to update the franchise
    connection.query(
      updateFranchiseQuery,
      [
        fname,
        lname,
        email,
        phone,
        gender,
        franchiseState,
        franchiseCity,
        franchiseId,
      ],
      (error, result) => {
        if (error) {
          console.error("Error executing SQL query:", error.message);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows === 1) {
          const updatedData = {
            fname,
            lname,
            email,
            phone,
            gender,
            franchiseState,
            franchiseCity,
            franchiseId,
          };

          res.status(200).json({
            message: "Franchise updated successfully",
            updatedData: updatedData,
          });
        } else {
          res.status(404).json({ message: "Franchise not found" });
        }
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.franchiseAddBankDetails = async (req,res) =>{
  try {
      const {
        user_id,
        holder_name,
        account_no,
        ifsc_code,
        branch_name,
        bank_name,
      } = req.body;
  
      // Check if the user_id already exists in the create_sho table
      const existingUserIdInFranchise =
        "SELECT * FROM create_franchise WHERE franchiseId = ?";
  
      connection.query(existingUserIdInFranchise, [user_id], (error, result) => {
        if (error) {
          console.error("Error checking sho existence:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }
  
        if (result.length === 0) {
          return res
            .status(404)
            .json({ message: "Franchise not found to create bank details" });
        }
  
        // User exists, proceed to insert bank details
        const insertBankShoQuery = `
          INSERT INTO bank_details (user_id, holder_name, account_no, ifsc_code, branch_name, bank_name)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
  
        connection.query(
          insertBankShoQuery,
          [user_id, holder_name, account_no, ifsc_code, branch_name, bank_name],
          (insertError, insertResult) => {
            if (insertError) {
              console.error("Error inserting bank details:", insertError);
              return res.status(500).json({ message: "Internal Server Error" });
            }
  
            return res
              .status(201)
              .json({ message: "Bank details added successfully for SHO" });
          }
        );
      });
    } catch (error) {
      console.log("Error in try-catch block:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
}

// fetchFranchiseBankDetails
exports.fetchFranchiseBankDetails = async (req,res) => {
  try {
    const { franchiseId } = req.body;

    if (!franchiseId) {
      return res.status(400).json({ message: "FranchiseId is required" });
    }

    const bankDetailsQuery = "SELECT * FROM bank_details WHERE user_id = ?";

    connection.query(bankDetailsQuery, [franchiseId], (error, result) => {
      if (error) {
        console.error("Error fetching bank details:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Bank details not found for the given FranchiseId" });
      }

      return res.status(200).json({ message: "Bank details fetched", result });
    });
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


