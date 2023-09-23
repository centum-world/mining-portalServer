const express = require("express");
const router = express.Router();

const { loginFranchise } = require("../controllers/franchiseController");

router.post("/login-franchise", loginFranchise);

module.exports = router;
