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
      .json({ message: "Internal server error" });
  }
};

//fetch particular franchise 

exports.fetchParticularFranchise = async(req, res) => {
  try {

    const {franchiseId} = req.body

    if(!franchiseId){
      return res.status(400).json({message: "Franchise Id is required"})

    }

    const findFranchiseQuery = "SELECT * FROM create_Franchise WHERE franchiseId = ?"

    const [franchise] = await queryAsync(findFranchiseQuery, [franchiseId])

     if(!franchise){
      return res.status(404).json({message: " Franchise not found"})
     }
    return res.status(200).json({message: "Franchise details fetched successfully", franchise})
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal server Error" });
  }
}