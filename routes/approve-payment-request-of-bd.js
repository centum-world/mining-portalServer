const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");

const {  approvePaymentRequestOfBd } = require("../controllers/adminControllers");

router.post("/approve-payment-request-of-bd", isAuthenticated,authorizeRole(["admin"]), approvePaymentRequestOfBd)

module.exports = router;
