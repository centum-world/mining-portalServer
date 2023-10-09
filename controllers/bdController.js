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

      return res
        .status(200)
        .json({ message: "Bd details fetched successfully", result });
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
          return res.status(404).json({ message: "Business developer not found" });
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

    const updateBdQuery = "UPDATE create_bd SET isVerify = 1 WHERE businessDeveloperId = ?";

    connection.query(
      updateBdQuery,
      [businessDeveloperId],
      (error, result) => {
        if (error) {
          console.error("Error executing SQL query:", error.message);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Business developer not found" });
        }

        res.status(200).json({ message: "This business developer is verified successfully." });
      }
    );
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
      [fname, lname, email, phone, gender, state, businessCity, businessDeveloperId],
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

