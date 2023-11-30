const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {   fetchUpgradeDowngradeBmm } = require("../controllers/adminControllers");

router.get("/fetch-upgrade-downgrade-bmm", isAuthenticated,authorizeRole(["admin"]), fetchUpgradeDowngradeBmm)

module.exports = router;
