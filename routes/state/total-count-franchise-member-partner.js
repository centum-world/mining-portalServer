const express = require("express");
const router = express.Router();

const { totalcountFranchiseMemberPartner } = require("../../controllers/stateController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/state/total-count-franchise-member-partner", isAuthenticated,authorizeRole(["state"]), totalcountFranchiseMemberPartner)

module.exports = router;
