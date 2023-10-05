const express = require("express");
const router = express.Router();

const {
   createPaymentRequest,
} = require("../../controllers/stateController");
const {
  isAuthenticated,
  authorizeRole,
} = require("../../middleware/checkAuth");

router.post(
  "/create-sho-payment-request",
  isAuthenticated,
  authorizeRole(["state"], "franchise"),
  createPaymentRequest
);

module.exports = router;

