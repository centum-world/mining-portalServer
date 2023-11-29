const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {   fetchUnVerifiedBmm } = require("../controllers/adminControllers");

router.get("/fetch-unVerified-Bmm", isAuthenticated,authorizeRole(["admin"]), fetchUnVerifiedBmm)

module.exports = router;
