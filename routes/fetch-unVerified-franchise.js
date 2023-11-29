const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {   fetchUnVerifiedFranchise } = require("../controllers/adminControllers");

router.get("/fetch-unVerified-franchise", isAuthenticated,authorizeRole(["admin"]), fetchUnVerifiedFranchise)

module.exports = router;
