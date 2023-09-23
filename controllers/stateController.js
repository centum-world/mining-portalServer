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
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "Database Error", error: error.message });
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
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "Database Error", error: error.message });
  }
};
