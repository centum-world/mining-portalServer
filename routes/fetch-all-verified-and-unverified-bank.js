const express = require("express");
const router = express.Router();

const {
  fetchAllVerifedAndUnverifiedBank,
} = require("../controllers/adminControllers");
const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
router.get(
  "/fetch-all-verified-and-unverified-bank",
  isAuthenticated,
  authorizeRole(["admin"]),
  fetchAllVerifedAndUnverifiedBank
);

module.exports = router;
