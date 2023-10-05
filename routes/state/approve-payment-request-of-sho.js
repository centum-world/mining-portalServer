const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");
const {   approvePaymentRequestOfSho } = require("../../controllers/adminControllers");

router.post("/approve-payment-request-of-sho", isAuthenticated,authorizeRole(["admin"]), approvePaymentRequestOfSho)

module.exports = router;
