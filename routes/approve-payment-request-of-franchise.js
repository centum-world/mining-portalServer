const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");

const { approvePaymentRequestOfFranchise } = require("../controllers/adminControllers");

router.post("/approve-payment-request-of-franchise", isAuthenticated,authorizeRole(["admin"]), approvePaymentRequestOfFranchise)

module.exports = router;
