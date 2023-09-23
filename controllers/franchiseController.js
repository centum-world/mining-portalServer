const connection = require("../config/database");
const bcrypt = require("bcrypt");
const { queryAsync } = require("../utils/utility");
const jwt = require("jsonwebtoken");

exports.loginFranchise = async (req, res) => {
  try {
    const { userid, password } = req.body;

    // Check if required fields are missing
    if (!userid || !password) {
      return res
        .status(422)
        .json({ message: "Please provide Franchise  Id  and password." });
    }

    const findUserQuery = "SELECT * from create_Franchise WHERE franchiseId=?";
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
      {  f_userid: user.franchiseId, role: "franchise" },
      process.env.ACCESS_TOKEN
    );

    return res.status(200).json({ message: "Login successfully", user, token });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Database Error", error: error.message });
  }
};
