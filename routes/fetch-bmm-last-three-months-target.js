const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const { fetchBmmLastThreeMonthsTarget } = require("../controllers/adminControllers");

router.post("/fetch-bmm-last-three-months-target", isAuthenticated,authorizeRole(["admin"]), fetchBmmLastThreeMonthsTarget)

module.exports = router;
