const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {   fetchVerifiedMember } = require("../controllers/adminControllers");

router.get("/fetch-verified-member", isAuthenticated,authorizeRole(["admin"]), fetchVerifiedMember)

module.exports = router;
