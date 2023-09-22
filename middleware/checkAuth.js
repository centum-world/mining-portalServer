const jwt = require('jsonwebtoken');
require('dotenv').config();
function verifyToken(req, res, next) {

    const token = req.headers['authorization']?.split(" ")[1];
    //const token1 = token.split(" ")[1];
    //console.log(token);
    if (!token) {
        return res.status(403).json("Unauthorized");
    }
    try {
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.token = decodeToken;
    } catch (error) {
        return res.status(400).json("Invalid Token");
    }
    return next();
}


module.exports = {
    checkAuth: verifyToken
}


// module.exports = {
//     checkAuth: verifyToken
//  }

// function verifyToken(req,res,next){

//     const token = req.body.token || req.headers["authorizarion"];
//     console.log(token);
//     if(!token){
//        return  res.status(403).json("Unauthorized");
//     }
//     try {
//         const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN);
//         req.token = decodeToken;
//     } catch (error) {
//         return  res.status(400).json("Invalid Token");
//     }
//     return next();
// }