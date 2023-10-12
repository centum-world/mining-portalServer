const express = require("express");
const router = express.Router();

const {   bdAddBankDetails } = require("../../controllers/bdController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/bd-add-bank-details",isAuthenticated, authorizeRole(["bd"]), bdAddBankDetails);

module.exports = router;

