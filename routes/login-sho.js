const express = require("express");
const router = express.Router();

const { loginSHO } = require("../controllers/stateController");

router.post("/login-sho", loginSHO);

module.exports = router;
