const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {   fetchVerifiedBmm } = require("../controllers/adminControllers");

router.get("/fetch-verified-bmm", isAuthenticated,authorizeRole(["admin"]), fetchVerifiedBmm)

module.exports = router;
