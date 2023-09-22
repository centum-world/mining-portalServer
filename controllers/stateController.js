const connection = require("../config/database");
const bcrypt = require("bcrypt");
const { queryAsync } = require("../utils/utility");
const jwt = require("jsonwebtoken")

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
      return res.status(401).json({ message: "Invalid State Handler  Id  or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid State Handler  Id  or password." });
    }

    //generate jwt token
    const token = jwt.sign({userId: user.stateHandlerId, role:"state"}, process.env.SECRET_KEY
        )

    return res.status(200).json({ message: "Login successfully", user, token });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "Database Error", error: error.message });
  }
};
