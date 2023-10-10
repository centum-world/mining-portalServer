const express = require("express");
const router = express.Router();

const { createBdPaymentRequest } = require("../../controllers/bdController");
const {
  isAuthenticated,
  authorizeRole,
} = require("../../middleware/checkAuth");

router.post(
  "/bd/create-bd-payment-request",
  isAuthenticated,
  authorizeRole([ "bd"]),
  createBdPaymentRequest
);

module.exports = router;
