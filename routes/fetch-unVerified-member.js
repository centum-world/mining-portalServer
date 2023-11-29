const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {   fetchUnVerifiedMember } = require("../controllers/adminControllers");

router.get("/fetch-unVerified-member", isAuthenticated,authorizeRole(["admin"]), fetchUnVerifiedMember)

module.exports = router;
