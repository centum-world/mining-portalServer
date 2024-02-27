const express = require("express");
const router = express.Router();

const {  fetchTransactionHistory } = require("../controllers/adminControllers");
const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");

router.post("/fetch-transaction-history", isAuthenticated,authorizeRole(["state","admin", "franchise","member"]), fetchTransactionHistory)

module.exports = router;