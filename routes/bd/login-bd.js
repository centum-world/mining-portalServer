const express = require("express");
const router = express.Router();

const { loginBd } = require("../../controllers/bdController");

router.post("/login-bd", loginBd);

module.exports = router;
