const express = require("express");
const router = express.Router();

const {  statePartnerMyTeam } = require("../../controllers/stateController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/state/my-partner-team", isAuthenticated,authorizeRole(["state","admin", "franchise", "bd"]), statePartnerMyTeam)

module.exports = router;
//route