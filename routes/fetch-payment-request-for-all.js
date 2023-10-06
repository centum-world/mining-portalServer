const express = require("express");
//const connection = require('../config/database');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {
  fetchPaymentRequestForAll,
} = require("../controllers/adminControllers");

router.post(
  "/fetch-payment-request-for-all",
  isAuthenticated,
  authorizeRole(["state", "franchise", "admin"]),
  fetchPaymentRequestForAll
);

module.exports = router;
