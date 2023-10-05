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

exports.loginSHO = async (req, res) => {
  try {
    const { userid, password } = req.body;

    // Check if required fields are missing
    if (!userid || !password) {
      return res
        .status(422)
        .json({ message: "Please provide State Handler  Id  and password." });
    }

    const findUserQuery = "SELECT * from create_sho WHERE stateHandlerId =?";
    const [user] = await queryAsync(findUserQuery, [userid]);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid State Handler  Id  or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Invalid State Handler  Id  or password." });
    }

    //generate jwt token
    const token = jwt.sign(
      { s_userid: user.stateHandlerId, role: "state" },
      process.env.ACCESS_TOKEN
    );

    return res.status(200).json({ message: "Login successfully", user, token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

//fetch particular sho details

exports.fetchParticularSHO = async (req, res) => {
  try {
    const { stateHandlerId } = req.body;

    if (!stateHandlerId) {
      return res.status(400).json({ message: "State Handler ID is required." });
    }

    const findSHOQuery = "SELECT * FROM  create_sho  WHERE stateHandlerId = ?";

    const [sho] = await queryAsync(findSHOQuery, [stateHandlerId]);

    if (!sho) {
      return res.status(404).json({ message: "SHO not found." });
    }

    return res
      .status(200)
      .json({ message: "SHO details fetched successfully", sho });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

exports.fetchAllStateOfSHO = async (req, res) => {
  try {
    const { referralId } = req.body;

    if (!referralId) {
      return res.status(400).json({ message: "Referral Id is required." });
    }

    const findSHOQuery =
      "SELECT selectedState FROM create_sho WHERE referralId = ?";
    const [sho] = await queryAsync(findSHOQuery, [referralId]);

    if (!sho) {
      return res.status(404).json({ message: "SHO not found" });
    }

    const selectedState = sho.selectedState;

    return res
      .status(200)
      .json({ message: "All state of SHO fetched", selectedState });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

// exports.fetchAllOwnFranchiseInState = async (req, res) => {
//   try {
//     const referralId = req.body;

//     if (!referralId) {
//       return res.status(404).json({ message: "Referral Id is required" });
//     }

//     const findFranchiseQuery =
//       "SELECT * from create_Franchise WHERE referredId = ?";
//     const [franchiseRows] = queryAsync(findFranchiseQuery, [referralId]);

//     if (franchiseRows.length == 0) {
//       return res
//         .status(404)
//         .json({ message: "Franchises not found for the given state" });
//     }

//     return res.status(200).json({
//       message: "All Own Franchise fetched successfully",
//       franchise: franchiseRows,
//     });
//   } catch (error) {
//     console.error("Error fetching franchises:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

exports.fetchAllOwnFranchiseInState = async (req, res) => {
  try {
    const { referralId } = req.body; // Destructure referralId from the request body

    if (!referralId) {
      return res.status(404).json({ message: "Referral Id is required" });
    }

    const findFranchiseQuery =
      "SELECT * from create_franchise WHERE referredId = ?";

    // Use connection.query directly
    connection.query(
      findFranchiseQuery,
      [referralId],
      (error, franchiseRows) => {
        if (error) {
          console.error("Error fetching franchises:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (franchiseRows.length === 0) {
          return res
            .status(404)
            .json({ message: "Franchises not found for the given state" });
        }

        return res.status(200).json({
          message: "All Own Franchise fetched successfully",
          franchise: franchiseRows,
        });
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Add back details for sho

exports.CreateBankDetailsForSho = async (req, res) => {
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
    const existingUserIdInSho =
      "SELECT * FROM create_sho WHERE stateHandlerId = ?";

    connection.query(existingUserIdInSho, [user_id], (error, result) => {
      if (error) {
        console.error("Error checking sho existence:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "User not found in create_sho table" });
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
};

// fetchOwnBankDetails
exports.fetchOwnBankDetails = async (req, res) => {
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

exports.updateSho = async (req, res) => {
  try {
    const {
      fname,
      lname,
      email,
      phone,
      gender,
      selectedState,
      stateHandlerId,
    } = req.body;

    const requiredFields = [
      "fname",
      "lname",
      "email",
      "phone",
      "gender",
      "selectedState",
      "stateHandlerId",
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

    // Construct the SQL query to update the sho
    const updateShoQuery =
      "UPDATE create_sho SET fname=?, lname=?, email=?, phone=?, gender=?, selectedState=? WHERE stateHandlerId=?";

    // Execute the SQL query to update the franchise
    connection.query(
      updateShoQuery,
      [fname, lname, email, phone, gender, selectedState, stateHandlerId],
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
            selectedState,
            stateHandlerId,
          };

          res.status(200).json({
            message: "Sho updated successfully",
            updatedData: updatedData,
          });
        } else {
          res.status(404).json({ message: "S.H.O not found" });
        }
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifySho = async (req, res) => {
  try {
    const { stateHandlerId, isVerify } = req.body;

    if (typeof isVerify != "boolean") {
      return res.status(400).json({ message: "Invalid 'isVerify' value" });
    }

    const upadteShoQuery =
      "UPDATE create_sho SET isVerify =? WHERE stateHandlerId = ?";

    connection.query(
      upadteShoQuery,
      [isVerify, stateHandlerId],
      (error, result) => {
        if (error) {
          console.error("Error updating sho:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows == 0) {
          return res.status(200).json({ message: "S.H.O not found" });
        }

        return res.status(200).json({ message: "S.H.O verified" });
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createStatePaymentRequest = async (req, res) => {
  try {
    const { stateHandlerId, amount, paymentBy } = req.body;

    if (!stateHandlerId || !amount || !paymentBy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the state handler exists
    const stateQuery = "SELECT * FROM create_sho WHERE stateHandlerId = ?";
    const [state] = await queryAsync(stateQuery, [stateHandlerId]);

    if (!state) {
      return res.status(404).json({ message: "S.H.O not found" });
    }

    if (amount < 1) {
      return res.status(400).json({ message: "Minimum request amount should be 1" });
    }

    if (state.stateHandlerWallet < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Start a transaction to ensure data consistency
    await beginTransaction();

    // Deduct the amount from the state handler's wallet
    const updateWalletQuery = `
      UPDATE create_sho
      SET stateHandlerWallet = stateHandlerWallet - ?,
          paymentRequestCount = paymentRequestCount + 1,
          firstPayment = 0,
          verifyDate = NOW()
      WHERE stateHandlerId = ?
    `;

    await queryAsync(updateWalletQuery, [amount, stateHandlerId]);

    // Insert the new payment request
    const insertPaymentRequestQuery = `
      INSERT INTO StatePaymentRequest (stateHandlerId, amount, paymentBy, createdAt)
      VALUES (?, ?, ?, NOW())
    `;

    const [result] = await queryAsync(insertPaymentRequestQuery, [stateHandlerId, amount, paymentBy]);

    // Commit the transaction
    await commitTransaction();

    res.status(201).json({
      message: "Payment requested successfully",
      savedPaymentRequest: {
        paymentRequestId: result.insertId,
        stateHandlerId,
        amount,
        paymentBy,
      },
    });
  } catch (error) {
    console.error("Error creating state payment request:", error);

    // Rollback the transaction in case of an error
    await rollbackTransaction();

    res.status(500).json({ message: "Internal server error" });
  }
};
