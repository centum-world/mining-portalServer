const express = require("express");
const router = express.Router();

const {  fetchWithdrawalRequestHistroy } = require("../../controllers/bdController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/bd/fetch-withdrawal-request",isAuthenticated, authorizeRole(["bd", "admin"]), fetchWithdrawalRequestHistroy);

module.exports = router;
