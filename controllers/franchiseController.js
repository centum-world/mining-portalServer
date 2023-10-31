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

    const cityList = franchiseCity.join(',');

    // Construct the SQL query to update the franchise
    console.log(phone, 180)
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
        cityList,
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

exports.franchiseAddBankDetails = async (req, res) => {
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
            .json({ message: "Bank details added successfully for franchise" });
        }
      );
    });
  } catch (error) {
    console.log("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// fetchFranchiseBankDetails
exports.fetchFranchiseBankDetails = async (req, res) => {
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

// create payment request for franchise

exports.createFranchisePaymentRequest = async (req, res) => {
  try {
    const { userId, amount, paymentBy } = req.body;

    if (!userId || !amount || !paymentBy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the state handler exists
    const stateQuery = "SELECT * FROM create_franchise WHERE franchiseId = ?";
    connection.query(stateQuery, [userId], (error, results) => {
      if (error) {
        console.error("Error checking franchise:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Franchise not found" });
      }

      const franchise = results[0];

      if (amount < 1) {
        return res
          .status(400)
          .json({ message: "Minimum request amount should be 1" });
      }

      if (franchise.franchiseWallet < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Deduct the amount from the state handler's wallet
      const updateWalletQuery = `
        UPDATE create_franchise
        SET franchiseWallet = franchiseWallet - ?,
            paymentRequestCount = paymentRequestCount + 1,
            firstPayment = 0,
            verifyDate = NOW()
        WHERE franchiseId = ?
      `;

      connection.query(updateWalletQuery, [amount, userId], (error) => {
        if (error) {
          console.error("Error updating franchise wallet:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        // Insert the new payment request
        const insertPaymentRequestQuery = `
          INSERT INTO payment_request (userId, amount, paymentBy, requestDate)
          VALUES (?, ?, ?, NOW())
        `;

        connection.query(
          insertPaymentRequestQuery,
          [userId, amount, paymentBy],
          (error, result) => {
            if (error) {
              console.error("Error creating payment request:", error);
              return res.status(500).json({ message: "Internal Server Error" });
            }

            // Check if the user has any bank details
            const checkBankDetailsQuery =
              "SELECT * FROM bank_details WHERE user_id = ?";
            connection.query(
              checkBankDetailsQuery,
              [userId],
              (error, bankResults) => {
                if (error) {
                  console.error("Error checking bank details:", error);
                  return res
                    .status(500)
                    .json({ message: "Internal Server Error" });
                }

                // If no bank details found for the user, provide a message
                if (bankResults.length === 0) {
                  return res
                    .status(400)
                    .json({ message: "Please add bank details" });
                }

                // Check if the user has a primary bank
                const checkPrimaryBankQuery =
                  "SELECT * FROM bank_details WHERE user_id = ? AND isPrimary = 1";
                connection.query(
                  checkPrimaryBankQuery,
                  [userId],
                  (error, bankResults) => {
                    if (error) {
                      console.error("Error checking primary bank:", error);
                      return res
                        .status(500)
                        .json({ message: "Internal Server Error" });
                    }

                    if (bankResults.length === 0) {
                      return res
                        .status(400)
                        .json({ message: "Please add a primary bank" });
                    }

                    res.status(201).json({
                      message: "Payment requested successfully",
                      savedPaymentRequest: {
                        userId,
                        amount,
                        paymentBy,
                      },
                    });
                  }
                );
              }
            );
          }
        );
      });
    });
  } catch (error) {
    console.error("Error in try-catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


exports.allBdDetailsReferredByFranchise = (req, res) => {
  try {
    const { referralId } = req.body;

    const findBdquery = "SELECT * FROM create_bd WHERE referredId = ?";

    connection.query(findBdquery, [referralId], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "No Business Developers found with this referralId." });
      }

      return res.status(200).json({ message: "Business Developers referred by Franchise fetched successfully", results });
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// fetchTotalWithdrawal
exports.fetchTotalWithdrawal = async (req, res) => {
  const { userId } = req.body;

  const query = "SELECT SUM(amount) AS sumofTotalWithdrawal FROM payment_approve WHERE userId = ?";
  connection.query(query, [userId], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        // You may want to check if there are results before accessing the data
        return res.status(200).json({
          message: "Fetched Sum Of All Withdrawal successfully",
          data: results[0].sumofTotalWithdrawal, // Access the sum
        });
      } else {
        return res.status(404).json({
          message: "No records found for the given userId",
        });
      }
    } else {
      return res.status(500).json(err);
    }
  });
}

// fetchPartnerMyTeam
exports.fetchPartnerMyTeam = async (req, res) => {
  const { referralId } = req.body

  const findbdquery = "SELECT * FROM create_bd Where referredId = ?";

  connection.query(findbdquery, [referralId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "internal server error" });
    }
    if (result.length == 0) {
      return res
        .status(404)
        .json({ message: "BusinessDev not found" });
    }
    const businessReferredIds = result.map((entry) => entry.referralId);
    // console.log(businessReferredIds)

    const findMemberQuery = "SELECT * FROM create_member WHERE m_refferid IN (?)";
    connection.query(findMemberQuery, [businessReferredIds], (err, memberResult) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      if (memberResult.length === 0) {
        return res.status(404).json({ message: "No Member found" });
      }

      const memberDetails = memberResult;
      const refferIds = memberDetails.map((member) => member.reffer_id);

      const findPartnerQuery = "SELECT * FROM mining_partner WHERE p_reffered_id IN (?)";
      connection.query(findPartnerQuery, [refferIds], (err, partnerResult) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        }
        if (partnerResult.length === 0) {
          return res.status(404).json({ message: "No Partners found" });
        }
  
        const partnerDetails = partnerResult;
      
        return res.status(200).json({ message: "Partner details fetched", partnerDetails });
      });

    });
  })
}
   