const connection = require("../config/database");
const bcrypt = require("bcrypt");
const { queryAsync } = require("../utils/utility");
const jwt = require("jsonwebtoken")


// exports.loginFranchise = async(req, res) => {
//     try {
//         const { userid, password} = req.body

//     // Check if required fields are missing
//     if (!userid || !password) {
//         return res
//           .status(422)
//           .json({ message: "Please provide Franchise  Id  and password." });
//       }

//       const findUserQuery  = "S"





//     } catch (error) {
        
//     }
// }