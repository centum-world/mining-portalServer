const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const { fetchBankDetails } = require("../controllers/adminControllers");

router.post("/fetch-bank-details", isAuthenticated,authorizeRole(["admin"]), fetchBankDetails)

module.exports = router;
