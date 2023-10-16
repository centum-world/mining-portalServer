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

exports.loginBd = async (req, res) => {
  try {
    const { userid, password } = req.body;

    // Check if required fields are missing
    if (!userid || !password) {
      return res.status(422).json({
        message: "Please provide Business developer Id  and password.",
      });
    }

    const findUserQuery =
      "SELECT * from create_bd WHERE businessDeveloperId =?";
    const [user] = await queryAsync(findUserQuery, [userid]);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid Business developer  Id  or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Invalid Business developer  Id  or password." });
    }

    //generate jwt token
    const token = jwt.sign(
      { b_userid: user.businessDeveloperId, role: "bd" },
      process.env.ACCESS_TOKEN
    );

    return res.status(200).json({ message: "Login successfully", user, token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

exports.fetchParticularBd = async (req, res) => {
  try {
    const { businessDeveloperId } = req.body;

    const findBdquery = "SELECT * FROM create_bd Where businessDeveloperId = ?";

    connection.query(findBdquery, [businessDeveloperId], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "internaln server erro" });
      }
      if (result.length == 0) {
        return res
          .status(404)
          .json({ message: "Business Developer not found" });
      }

      const bdDetails = result[0];

      return res
        .status(200)
        .json({ message: "Bd details fetched successfully", bdDetails });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.blockAndUnblockBd = async (req, res) => {
  try {
    const { isBlocked, businessDeveloperId } = req.body;

    const updateBdQuery =
      "UPDATE create_bd SET isBlocked = ? WHERE businessDeveloperId = ?";

    connection.query(
      updateBdQuery,
      [isBlocked, businessDeveloperId],
      (error, result) => {
        if (error) {
          console.error("Error executing SQL query:", error.message);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Business developer not found" });
        }

        const message = isBlocked
          ? "This business dveloper is blocked successfully."
          : "This business dveloper is unblocked successfully.";

        res.status(200).json({ message });
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyBd = async (req, res) => {
  try {
    const { businessDeveloperId } = req.body;

    const updateBdQuery =
      "UPDATE create_bd SET isVerify = 1 WHERE businessDeveloperId = ?";

    connection.query(updateBdQuery, [businessDeveloperId], (error, result) => {
      if (error) {
        console.error("Error executing SQL query:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Business developer not found" });
      }

      res
        .status(200)
        .json({ message: "This business developer is verified successfully." });
    });
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.updateBd = async (req, res) => {
  try {
    const {
      fname,
      lname,
      email,
      phone,
      gender,
      state,
      businessCity,
      businessDeveloperId,
    } = req.body;

    const requiredFields = [
      "fname",
      "lname",
      "email",
      "phone",
      "gender",
      "state",
      "businessCity",
      "businessDeveloperId",
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

    // Construct the SQL query to update the business developer
    const updateBdQuery =
      "UPDATE create_bd SET fname=?, lname=?, email=?, phone=?, gender=?, state=?, businessCity=? WHERE businessDeveloperId=?";

    // Execute the SQL query to update the business developer
    connection.query(
      updateBdQuery,
      [
        fname,
        lname,
        email,
        phone,
        gender,
        state,
        businessCity,
        businessDeveloperId,
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
            state,
            businessCity,
            businessDeveloperId,
          };

          res.status(200).json({
            message: "Business Developer updated successfully",
            updatedData: updatedData,
          });
        } else {
          res.status(404).json({ message: "Business Developer not found" });
        }
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//add bank detaila for bd

exports.bdAddBankDetails = async (req, res) => {
  try {
    const {
      user_id,
      holder_name,
      account_no,
      ifsc_code,
      branch_name,
      bank_name,
    } = req.body;

    const existingUserIdInBd =
      "SELECT * FROM create_bd WHERE businessDeveloperId = ?";

    // Check if the business developer exists
    connection.query(existingUserIdInBd, [user_id], (error, result) => {
      if (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Business developer not found for adding bank details",
        });
      }

      const insertIntoBankBdQuery = `INSERT INTO bank_details (user_id,
        holder_name,
        account_no,
        ifsc_code,
        branch_name,
        bank_name) VALUES (?, ?, ?, ?, ?, ?)`;

      // Insert bank details into the database
      connection.query(
        insertIntoBankBdQuery,
        [user_id, holder_name, account_no, ifsc_code, branch_name, bank_name],
        (error, result) => {
          if (error) {
            console.error(error.message);
            return res.status(500).json({ message: "Internal server error" });
          }
          return res
            .status(201)
            .json({ message: "Bank details added successfully for BD" });
        }
      );
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//franchise payment request

exports.createBdPaymentRequest = async (req, res) => {
  try {
    const { userId, amount, paymentBy } = req.body;

    if (!userId || !amount || !paymentBy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the bd exists
    const stateQuery = "SELECT * FROM create_bd WHERE businessDeveloperId = ?";
    connection.query(stateQuery, [userId], (error, results) => {
      if (error) {
        console.error("Error checking business developer:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Business dveloper not found" });
      }

      const businessDeveloper = results[0];

      if (amount < 1) {
        return res
          .status(400)
          .json({ message: "Minimum request amount should be 1" });
      }

      if (businessDeveloper.bdWallet < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Deduct the amount from the state handler's wallet
      const updateWalletQuery = `
        UPDATE create_bd
        SET bdWallet = bdWallet - ?,
            paymentRequestCount = paymentRequestCount + 1,
            firstPayment = 0,
            verifyDate = NOW()
        WHERE businessDeveloperId = ?
      `;

      connection.query(updateWalletQuery, [amount, userId], (error) => {
        if (error) {
          console.error("Error updating business developer wallet:", error);
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
};

//fetch all members by particular bd referralId

exports.fetchMembersReferredByBd = async (req, res) => {
  try {
    const { referralId } = req.body;

    const findMembersQuery = "select * from create_member where m_refferid = ?";

    connection.query(findMembersQuery, [referralId], (error, results) => {
      if (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error." });
      }
      // Check if any results were found
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No members found for the given referralId." });
      }
      return res
        .status(200)
        .json({ message: "Members fetched by given referral Id.", results });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// fetchWithdrawalRequestHistroy
exports.fetchWithdrawalRequestHistroy = async (req, res) => {
  try {
    const { userId } = req.body;

    const findBdquery = "SELECT * FROM  payment_request Where userId = ?";

    connection.query(findBdquery, [userId], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "internaln server erro" });
      }
      if (result.length == 0) {
        return res
          .status(404)
          .json({ message: "Business Developer not found" });
      }

      const withdrawalRequest = result;

      return res
        .status(200)
        .json({ message: "Withdrawal request fetched", withdrawalRequest });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// fetchWithdrawalSuccessHistory
exports.fetchWithdrawalSuccessHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    const findBdquery = "SELECT * FROM  payment_approve Where userId = ?";

    connection.query(findBdquery, [userId], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
      }
      if (result.length == 0) {
        return res
          .status(404)
          .json({ message: "Business Developer not found" });
      }

      const withdrawalSuccess = result;

      return res
        .status(200)
        .json({ message: "Withdrawal History fetched", withdrawalSuccess });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

exports.businessDevTotalWithdrawal = async (req, res) => {
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

};

// businessDevFetchPartnerTeam
exports.businessDevFetchPartnerTeam = async (req, res) => {
  const { referralId } = req.body

  const findMemberquery = "SELECT * FROM create_member Where m_refferid = ?";

  connection.query(findMemberquery, [referralId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "internal server error" });
    }
    if (result.length == 0) {
      return res
        .status(404)
        .json({ message: "Member not found" });
    }
    // const foundMember = result;
    const memberReferredIds = result.map((entry) => entry.reffer_id);
    console.log(memberReferredIds)

      const findPartnerQuery = "SELECT * FROM mining_partner WHERE p_referred_id = ?";
    connection.query(findPartnerQuery, [memberReferredIds], (err, partnerResult) => {
      if (err) {
        console.error("Error in mining_partner query:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (partnerResult.length === 0) {
        return res.status(404).json({ message: "No Partners found" });
      }
      const foundPartners = partnerResult;
      return res.status(200).json({ message: "Partners found", foundPartners });
    });
    // const nameListItems = referredIds.map((name, index) => {
    //   const findPartnerQuery = "SELECT * FROM mining_partner where p_reffered_id = ?";
    //   connection.query(findPartnerQuery,[name],(err,result) => {
    //     if(err){
    //       return res.status(500).json({ message: "internal server error" });
    //     }
    //     if(result.length == 0){
    //       return res
    //       .status(404)
    //       .json({ message: "No Partner found" });
    //     }
    //     let partnerDetails = result[index];
    //     console.log(partnerDetails)
    //     return res
    // .status(200)
    // .json({ message: "Withdrawal request fetched", partnerDetails });
    //   })
  })
}

