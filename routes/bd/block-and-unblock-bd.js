const express = require("express");
const router = express.Router();

const { blockAndUnblockBd } = require("../../controllers/bdController");
const {
  isAuthenticated,
  authorizeRole,
} = require("../../middleware/checkAuth");

router.post(
  "/block-and-unblock-bd",
  isAuthenticated,
  authorizeRole(["admin", 'franchise']),
  blockAndUnblockBd
);

module.exports = router;
