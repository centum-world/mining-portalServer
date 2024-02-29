const express = require("express");
const router = express.Router();

const {
  isAuthenticated,
  authorizeRole,
} = require("../../middleware/checkAuth");
const { totalCountPartner } = require("../../controllers/memberControllers");

router.post(
  "/member/member-withdrawal-request",
  isAuthenticated,
  authorizeRole(["member"]),
  totalCountPartner
);
module.exports = router;
