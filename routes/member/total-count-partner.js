const express = require("express");
const router = express.Router();

const {
  isAuthenticated,
  authorizeRole,
} = require("../../middleware/checkAuth");
const { totalCountPartner } = require("../../controllers/memberControllers");

router.post(
  "/member/total-count-partner",
  isAuthenticated,
  authorizeRole(["member"]),
  totalCountPartner
);
module.exports = router;
