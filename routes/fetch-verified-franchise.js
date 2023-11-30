const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {   fetchVerifiedFranchise } = require("../controllers/adminControllers");

router.get("/fetch-verified-franchise", isAuthenticated,authorizeRole(["admin"]), fetchVerifiedFranchise)

module.exports = router;
