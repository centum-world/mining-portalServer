const connection = require("../config/database");
const bcrypt = require("bcrypt");
const { queryAsync } = require("../utils/utility");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const {
  isValidImage,
  isValidEmail,
  isValidPhone,
  isValidName,
  isValidPassword,
  isValidUserId,
} = require("../utils/validation");
const { connect } = require("..");

exports.loginSHO = async (req, res) => {
  try {
    const { userid, password } = req.body;

    // Check if required fields are missing
    if (!userid || !password) {
      return res
        .status(422)
        .json({ message: "Please provide User  Id  and password." });
    }

    const findBMMQuery = "SELECT * from create_sho WHERE stateHandlerId =?";

    const [bmm] = await connection.promise().query(findBMMQuery, [userid]);
    if (!bmm || bmm.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid User  Id  or password." });
    }

    const user = bmm[0];
    console.log(user, "user");

    if (user.priority === 0) {
      const findFranchiseQuery =
        "SELECT * FROM create_franchise WHERE franchiseId =?";

      const [franchise] = await connection
        .promise()
        .query(findFranchiseQuery, [userid]);

      if (franchise && franchise.length > 0 && franchise[0].priority === 1) {
        return res.status(400).json({
          message:
            "Now, you have become a Franchise. Please login from Franchise dashboard.",
        });
      }

      const findMemberQuery = "SELECT * FROM create_member WHERE m_userid =?";

      const [member] = await connection
        .promise()
        .query(findMemberQuery, [userid]);

      if (member && member.length > 0 && member[0].priority === 1) {
        return res.status(400).json({
          message:
            "Now, you have become a member. Please login from member dashboard.",
        });
      }
      return res
        .status(400)
        .json({ message: "You have been upgraded or downgraded." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid User Id  or password." });
    }

    //generate jwt token
    const token = jwt.sign(
      { s_userid: user.stateHandlerId, role: "state" },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: 28800,
      }
    );

    return res
      .status(200)
      .json({ message: "BMM login successfully", user, token });
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
      return res.status(400).json({ message: "State User ID is required." });
    }

    const findSHOQuery = "SELECT * FROM  create_sho  WHERE stateHandlerId = ?";

    const [sho] = await queryAsync(findSHOQuery, [stateHandlerId]);

    if (!sho) {
      return res.status(404).json({ message: "BMM not found." });
    }

    return res
      .status(200)
      .json({ message: "BMM details fetched successfully", sho });
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
      return res.status(404).json({ message: "BMM not found" });
    }

    const selectedState = sho.selectedState;

    return res
      .status(200)
      .json({ message: "All state of BMM fetched", selectedState });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

exports.fetchAllOwnFranchiseInState = async (req, res) => {
  try {
    const { referralId } = req.body;

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
        return res.status(404).json({ message: "User not found" });
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
            .json({ message: "Bank details added successfully for BMM" });
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
          .status(204)
          .json({ message: "No bank details found for the given userId" });
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

    const state = selectedState.join(",");
    const updateShoQuery =
      "UPDATE create_sho SET fname=?, lname=?, email=?, phone=?, gender=?, selectedState=? WHERE stateHandlerId=?";

    // Execute the SQL query to update the franchise
    connection.query(
      updateShoQuery,
      [fname, lname, email, phone, gender, state, stateHandlerId],
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
            stateHandlerId,
          };

          res.status(200).json({
            message: "BMM updated successfully",
            updatedData: updatedData,
          });
        } else {
          res.status(404).json({ message: "BMM not found" });
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

    let verifyDate = new Date();
    const updateShoQuery =
      "UPDATE create_sho SET isVerify = ?, verifyDate = ? WHERE stateHandlerId = ?";

    const [updateResult] = await connection.promise().query(updateShoQuery, [isVerify, verifyDate, stateHandlerId]);

    if (updateResult.affectedRows == 0) {
      return res.status(200).json({ message: "BMM not found" });
    }


    return res.status(200).json({ message: "BMM successfully verified" });
  } catch (error) {
    console.error("Error in try-catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Import the necessary modules and initialize your connection here

// ...

exports.createPaymentRequest = async (req, res) => {
  try {
    const { userId, amount, paymentBy } = req.body;

    if (!userId || !amount || !paymentBy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the state handler exists
    const stateQuery = "SELECT * FROM create_sho WHERE stateHandlerId = ?";
    connection.query(stateQuery, [userId], (error, results) => {
      if (error) {
        console.error("Error checking state handler:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "BMM not found" });
      }

      const state = results[0];

      if (amount < 1) {
        return res
          .status(400)
          .json({ message: "Minimum request amount should be 1" });
      }

      if (state.stateHandlerWallet < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Deduct the amount from the state handler's wallet
      const updateWalletQuery = `
        UPDATE create_sho
        SET stateHandlerWallet = stateHandlerWallet - ?,
            paymentRequestCount = paymentRequestCount + 1,
            firstPayment = 0,
            verifyDate = NOW()
        WHERE stateHandlerId = ?
      `;

      connection.query(updateWalletQuery, [amount, userId], (error) => {
        if (error) {
          console.error("Error updating state handler wallet:", error);
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

exports.makePrimaryBank = async (req, res) => {
  try {
    const { user_id, bank_name } = req.body;

    // Check if any bank details exist for the user
    const checkBankDetailsQuery =
      "SELECT * FROM bank_details WHERE user_id = ?";
    connection.query(
      checkBankDetailsQuery,
      [user_id],
      async (error, results) => {
        if (error) {
          console.error("Error checking bank details:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        // If no bank details found for the user, return a 404 response
        if (results.length === 0) {
          return res
            .status(404)
            .json({ message: "No bank details found for the user" });
        }

        // Clear the primary flag for all user's banks
        const clearPrimaryFlagQuery =
          "UPDATE bank_details SET isPrimary = 0 WHERE user_id = ?";
        connection.query(clearPrimaryFlagQuery, [user_id], async (error) => {
          if (error) {
            console.error("Error clearing primary flag:", error);
            return res.status(500).json({ message: "Internal Server Error" });
          }

          // Set the selected bank as primary
          const updateBankDetailsQuery =
            "UPDATE bank_details SET isPrimary = 1 WHERE user_id = ? AND bank_name = ?";
          connection.query(
            updateBankDetailsQuery,
            [user_id, bank_name],
            async (error, results) => {
              if (error) {
                console.error("Error updating bank details:", error);
                return res
                  .status(500)
                  .json({ message: "Internal Server Error" });
              }

              res
                .status(200)
                .json({ message: "Primary bank updated successfully" });
            }
          );
        });
      }
    );
  } catch (error) {
    console.error("Error in try-catch block:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.fetchPrimarybank = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Query to retrieve the primary bank for the user
    const fetchPrimaryBankQuery =
      "SELECT * FROM bank_details WHERE user_id = ? AND isPrimary = 1";

    connection.query(
      fetchPrimaryBankQuery,
      [user_id],
      async (error, results) => {
        if (error) {
          console.error("Error fetching primary bank:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        // Check if a primary bank was found
        if (results.length === 0) {
          return res
            .status(404)
            .json({ message: "No primary bank found for the user" });
        }

        // Return the primary bank details in the response
        const primaryBank = results[0];
        res.status(200).json({ primaryBank });
      }
    );
  } catch (error) {
    console.error("Error in fetch Primary bank try-catch block:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.statePartnerMyTeam = async (req, res) => {
  const { referralId } = req.body;

  const findFranchiseQuery =
    "SELECT * FROM create_franchise Where referredId = ?";

  connection.query(findFranchiseQuery, [referralId], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "internal server error" });
    }
    if (result.length == 0) {
      return res.status(404).json({ message: "Franchise not found" });
    }
    const franchiseReferredIds = result.map((entry) => entry.referralId);

    const findBdQuery = "SELECT * FROM create_bd WHERE referredId IN (?)";
    connection.query(findBdQuery, [franchiseReferredIds], (err, bdResult) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      if (bdResult.length === 0) {
        return res.status(404).json({ message: "No BD found" });
      }

      const bdDetails = bdResult;
      const bdReferralId = bdDetails.map(
        (businessDev) => businessDev.referralId
      );

      const findMemberQuery =
        "SELECT * FROM create_member WHERE  m_refferid IN (?)";
      connection.query(findMemberQuery, [bdReferralId], (err, memberResult) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        }
        if (memberResult.length === 0) {
          return res.status(404).json({ message: "No Partners found" });
        }

        const memberDetails = memberResult;
        const refferIds = memberDetails.map((member) => member.reffer_id);
        const findPartnerQuery =
          "SELECT * FROM mining_partner WHERE p_reffered_id IN (?)";
        connection.query(
          findPartnerQuery,
          [refferIds],
          (err, partnerResult) => {
            if (err) {
              return res.status(500).json({ message: "Internal server error" });
            }
            if (partnerResult.length === 0) {
              return res.status(404).json({ message: "No Partners found" });
            }

            const partnerDetails = partnerResult;

            return res
              .status(200)
              .json({ message: "Partner details fetched", partnerDetails });
          }
        );
      });
    });
  });
};

exports.fetchPartnerByReferralId = async (req, res) => {
  try {
    const { referralId } = req.body;

    console.log(referralId, "referral id");

    const franchiseQuery =
      "SELECT * FROM create_franchise WHERE referredId = ?";
    const [franchiseRows] = await connection
      .promise()
      .query(franchiseQuery, [referralId]);

    const franchiseReferredIds = franchiseRows.map((entry) => entry.referralId);

    console.log(franchiseReferredIds, "franchise referralIds");

    const memberQuery = "SELECT * FROM create_member WHERE m_refferid IN (?)";
    const [memberRows] = await connection
      .promise()
      .query(memberQuery, [franchiseReferredIds]);

    const memberReferredIds = memberRows.map((member) => member.reffer_id);

    console.log(memberReferredIds, "member referralids");

    let partnerRows = [];

    if (referralId && referralId.length > 0) {
      console.log("first condition");
      const partnerQuery =
        "SELECT * FROM mining_partner WHERE p_reffered_id IN (?)";
      const [result] = await connection
        .promise()
        .query(partnerQuery, [referralId]);
      partnerRows = partnerRows.concat(result);
    }

    if (franchiseReferredIds.length > 0) {
      console.log("2nd condition");
      const partnerQuery =
        "SELECT * FROM mining_partner WHERE p_reffered_id IN (?)";
      const [result] = await connection
        .promise()
        .query(partnerQuery, [franchiseReferredIds]);
      partnerRows = partnerRows.concat(result);
    }

    if (memberReferredIds.length > 0) {
      console.log("third condition");
      const partnerQuery =
        "SELECT * FROM mining_partner WHERE p_reffered_id IN (?)";
      const [result] = await connection
        .promise()
        .query(partnerQuery, [memberReferredIds]);
      partnerRows = partnerRows.concat(result);
    }

    console.log(partnerRows, "partner list");

    if (partnerRows.length === 0) {
      return res
        .status(200)
        .json({ message: "No partners found for the given referralId" });
    }

    return res.status(200).json({
      message: "Partners fetched successfully",
      partners: partnerRows,
    });
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.totalcountFranchiseMemberPartner = async (req, res) => {
  try {
    const { referralId } = req.body;

    if (!referralId) {
      return res.status(400).json({ error: "Referral ID is required." });
    }

    let totalFranchiseCount = 0;
    let todayFranchiseCount = 0;
    let totalMemberReferralCount = 0;
    let todayMemberReferralCount = 0;
    let totalPartnerCount = 0;
    let todayPartnerCount = 0;

    const findReferralIdQuery =
      "SELECT referralId FROM create_franchise WHERE isVerify = 1 AND referredId = ?";
    const [franchiseRows] = await connection
      .promise()
      .query(findReferralIdQuery, [referralId]);

    if (!franchiseRows[0]) {
      return res.status(200).json({
        totalFranchiseCount,
        todayFranchiseCount,
        totalMemberReferralCount,
        todayMemberReferralCount,
        totalPartnerCount,
        todayPartnerCount,
      });
    }

    const franchiseReferralIds = franchiseRows.map((entry) => entry.referralId);

    console.log(franchiseReferralIds, "973");

    // Fetch total franchise count
    const totalFranchiseQuery =
      "SELECT * FROM create_franchise WHERE isVerify = 1 AND referredId IN (?)";

    const [totalFranchiseResult] = await connection
      .promise()
      .query(totalFranchiseQuery, [referralId]);

    totalFranchiseCount = totalFranchiseResult.length;

    console.log(totalFranchiseCount, "count");

    // Fetch today's franchise count
    const todayFranchiseQuery =
      "SELECT COUNT(*) AS todayFranchiseCount FROM create_franchise WHERE isVerify = 1 AND referredId IN (?) AND DATE(verifyDate) = CURDATE()";
    const [todayFranchiseResult] = await connection
      .promise()
      .query(todayFranchiseQuery, [referralId]);
    todayFranchiseCount = todayFranchiseResult[0].todayFranchiseCount;

    console.log(todayFranchiseCount, "tday franchise count");

    // Check if franchiseReferralIds are present
    if (franchiseReferralIds.length > 0) {
      console.log("2nddddd conditon", franchiseReferralIds);
      // Find referralId in create_member based on m_refferid
      const findReferralIdMemberQuery =
        "SELECT reffer_id FROM create_member WHERE isVerify = 1 AND m_refferid IN (?)";

      const [findReferralIdMemberResult] = await connection
        .promise()
        .query(findReferralIdMemberQuery, [franchiseReferralIds]);

      console.log(findReferralIdMemberResult, "member result");

      if (findReferralIdMemberResult.length > 0) {
        console.log("2nd condition");

        const memberReferralIds = findReferralIdMemberResult.map(
          (member) => member.reffer_id
        );

        console.log(memberReferralIds, "member referralIds");

        // Fetch total member referral count
        const totalMemberReferralQuery =
          "SELECT COUNT(*) AS totalReferralCount FROM create_member WHERE isVerify = 1 AND m_refferid IN (?)";

        const [totalMemberReferralResult] = await connection
          .promise()
          .query(totalMemberReferralQuery, [franchiseReferralIds]);

        totalMemberReferralCount =
          totalMemberReferralResult[0].totalReferralCount;

        // Fetch today's member referral count
        const todayMemberReferralQuery =
          "SELECT COUNT(*) AS todayReferralCount FROM create_member WHERE isVerify = 1 AND m_refferid IN (?) AND DATE(verifyDate) = CURDATE()";

        const [todayMemberReferralResult] = await connection
          .promise()
          .query(todayMemberReferralQuery, [franchiseReferralIds]);
        todayMemberReferralCount =
          todayMemberReferralResult[0].todayReferralCount;

        console.log(
          referralId,
          franchiseReferralIds,
          memberReferralIds,
          "1043"
        );
        // Check if memberReferralIds are present
        if (referralId) {
          console.log("3rd 1 condition");
          // Fetch total Partner count
          const totalPartnerQuery =
            "SELECT COUNT(*) AS totalPartnerCount FROM mining_partner WHERE isVerify = 1 AND p_reffered_id IN (?)";
          const [totalPartnerResult] = await connection
            .promise()
            .query(totalPartnerQuery, [referralId]);

          // Fetch today's Partner count
          const todayPartnerQuery =
            "SELECT COUNT(*) AS todayPartnerCount FROM mining_partner WHERE isVerify = 1 AND p_reffered_id IN (?) AND DATE(verifyDate) = CURDATE()";
          const [todayPartnerResult] = await connection
            .promise()
            .query(todayPartnerQuery, [referralId]);

          totalPartnerCount += totalPartnerResult[0].totalPartnerCount;
          todayPartnerCount += todayPartnerResult[0].todayPartnerCount;
        }

        if (franchiseReferralIds.length > 0) {
          console.log("3rd 2 condition");

          console.log(franchiseReferralIds, "franchise referralId");
          // Fetch total Partner count
          const totalPartnerQuery =
            "SELECT COUNT(*) AS totalPartnerCount FROM mining_partner WHERE isVerify = 1 AND p_reffered_id IN (?)";
          const [totalPartnerResult] = await connection
            .promise()
            .query(totalPartnerQuery, [franchiseReferralIds]);

          // Fetch today's Partner count
          const todayPartnerQuery =
            "SELECT COUNT(*) AS todayPartnerCount FROM mining_partner WHERE isVerify = 1 AND p_reffered_id IN (?) AND DATE(verifyDate) = CURDATE()";
          const [todayPartnerResult] = await connection
            .promise()
            .query(todayPartnerQuery, [franchiseReferralIds]);

          totalPartnerCount += totalPartnerResult[0].totalPartnerCount;
          todayPartnerCount += todayPartnerResult[0].todayPartnerCount;
        }

        if (memberReferralIds.length > 0) {
          console.log("3rd  3 condition");

          // Fetch total Partner count
          const totalPartnerQuery =
            "SELECT COUNT(*) AS totalPartnerCount FROM mining_partner WHERE isVerify = 1 AND p_reffered_id IN (?)";
          const [totalPartnerResult] = await connection
            .promise()
            .query(totalPartnerQuery, [memberReferralIds]);

          // Fetch today's Partner count
          const todayPartnerQuery =
            "SELECT COUNT(*) AS todayPartnerCount FROM mining_partner WHERE isVerify = 1 AND p_reffered_id IN (?) AND DATE(verifyDate) = CURDATE()";
          const [todayPartnerResult] = await connection
            .promise()
            .query(todayPartnerQuery, [memberReferralIds]);

          totalPartnerCount += totalPartnerResult[0].totalPartnerCount;
          todayPartnerCount += todayPartnerResult[0].todayPartnerCount;
        }
      }
    }

    return res.status(200).json({
      totalFranchiseCount,
      todayFranchiseCount,
      totalMemberReferralCount,
      todayMemberReferralCount,
      totalPartnerCount,
      todayPartnerCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.fetchReferralMyTeam = async (req, res) => {
  try {
    const { referralId } = req.body;

    if (!referralId) {
      return res.status(404).json({ message: "Referral Id is required" });
    }

    const findFranchiseQuery =
      "SELECT * FROM create_franchise WHERE referredId = ?";

    const [franchiseResult] = await connection
      .promise()
      .query(findFranchiseQuery, [referralId]);

    if (franchiseResult.length === 0) {
      return res
        .status(404)
        .json({ message: "Franchise not found for the given Referral ID" });
    }

    const franchiseReferralId = franchiseResult.map(
      (franchise) => franchise.referralId
    );

    console.log(franchiseReferralId, "franchise referral Id");

    const findMemberQuery =
      "SELECT * FROM create_member WHERE m_refferid  IN (?)";

    const [memberResult] = await connection
      .promise()
      .query(findMemberQuery, [franchiseReferralId]);

    if (memberResult.length === 0) {
      return res
        .status(404)
        .json({ message: "Member not found for the given Referral ID" });
    }

    return res.status(200).json({
      message: "All Own Referral fetched successfully",
      Referral: memberResult,
    });
  } catch (error) {
    console.error("Error in try-catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
