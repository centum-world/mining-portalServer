const connection = require("../config/database");
const bcrypt = require("bcrypt");
const { queryAsync } = require("../utils/utility");
const jwt = require("jsonwebtoken");

exports.loginSHO = async (req, res) => {
  try {
    const { userid, password } = req.body;

    // Check if required fields are missing
    if (!userid || !password) {
      return res
        .status(422)
        .json({ message: "Please provide State Handler  Id  and password." });
    }

    const findUserQuery = "SELECT * from create_SHO WHERE stateHandlerId =?";
    const [user] = await queryAsync(findUserQuery, [userid]);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid State Handler  Id  or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
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

    const findSHOQuery = "SELECT * FROM  create_SHO  WHERE stateHandlerId = ?";

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
      "SELECT selectedState FROM create_SHO WHERE referralId = ?";
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
      "SELECT * from create_Franchise WHERE referredId = ?";
    
    // Use connection.query directly
    connection.query(findFranchiseQuery, [referralId], (error, franchiseRows) => {
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
    });
  } catch (error) {
    console.error("Error in try-catch block:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// franchise verify



