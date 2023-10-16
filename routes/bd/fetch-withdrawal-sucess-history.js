const express = require("express");
const router = express.Router();

const {  fetchWithdrawalSuccessHistory } = require("../../controllers/bdController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/bd/fetch-withdrawal-sucess-history",isAuthenticated, authorizeRole(["bd", "admin"]), fetchWithdrawalSuccessHistory);

module.exports = router;
