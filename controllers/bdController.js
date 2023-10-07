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
        return res
          .status(422)
          .json({ message: "Please provide Business developer Id  and password." });
      }
  
      const findUserQuery = "SELECT * from create_bd WHERE businessDeveloperId =?";
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