const express = require("express");
const router = express.Router();

const { fetchOwnBankDetails } = require("../../controllers/stateController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/state/fetch-own-bank-details", isAuthenticated,authorizeRole(["state"]), fetchOwnBankDetails)

module.exports = router;
//route