const express = require("express");
const router = express.Router();

const {  businessDevFetchPartnerTeam } = require("../../controllers/bdController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/bd/businessDev-fetch-partner-team",isAuthenticated, authorizeRole(["bd", "admin"]), businessDevFetchPartnerTeam);

module.exports = router;
