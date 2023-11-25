const express = require("express");
const router = express.Router();

const {  upgradeDowngradeRole } = require("../../controllers/stateController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/state/my-partner-team", upgradeDowngradeRole)

module.exports = router;
//route