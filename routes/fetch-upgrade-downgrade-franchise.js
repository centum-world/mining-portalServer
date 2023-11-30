const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {   fetchUpgradeDowngradeFranchise } = require("../controllers/adminControllers");

router.get("/fetch-upgrade-downgrade-franchise", isAuthenticated,authorizeRole(["admin"]), fetchUpgradeDowngradeFranchise)

module.exports = router;
