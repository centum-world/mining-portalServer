const express = require("express");
const router = express.Router();

const {  partnerFetchTransactionHistory } = require("../../controllers/partnerControllers");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/partner/fetch-transaction-history", isAuthenticated,authorizeRole(["state","admin", "franchise","member","partner"]), partnerFetchTransactionHistory)

module.exports = router;