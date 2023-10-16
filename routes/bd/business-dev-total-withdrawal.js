const express = require("express");
const router = express.Router();

const {  businessDevTotalWithdrawal } = require("../../controllers/bdController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/bd/business-dev-total-withdrawal",isAuthenticated, authorizeRole(["bd", "admin"]), businessDevTotalWithdrawal);

module.exports = router;
