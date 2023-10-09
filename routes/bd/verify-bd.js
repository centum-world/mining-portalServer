const express = require("express");
const router = express.Router();

const { verifyBd } = require("../../controllers/bdController");
const {
  isAuthenticated,
  authorizeRole,
} = require("../../middleware/checkAuth");

router.post(
  "/verify-bd",
  isAuthenticated,
  authorizeRole(["admin", 'franchise']),
  verifyBd
);

module.exports = router;
