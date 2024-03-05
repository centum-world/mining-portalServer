const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const { fetchFranchiseLastThreeMonthsTarget } = require("../controllers/adminControllers");

router.post("/fetch-franchise-last-three-months-target", isAuthenticated,authorizeRole(["admin"]), fetchFranchiseLastThreeMonthsTarget)

module.exports = router;
