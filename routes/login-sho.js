const express = require("express");
const router = express.Router();
const upload  = require("../utils/aws"); // Import Multer upload middleware

const { loginSHO } = require("../controllers/stateController");

router.post("/login-sho", loginSHO);

module.exports = router;
