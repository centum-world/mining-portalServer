const express = require("express");
const router = express.Router();

const { CreateBankDetailsForSho } = require("../controllers/stateController");
const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");

router.post("/create-bank-details-for-sho", isAuthenticated,authorizeRole(["state"]), CreateBankDetailsForSho)

module.exports = router;
//route