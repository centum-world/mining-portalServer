const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { fetchParticularPaymentApprove } = require('../controllers/adminControllers');

router.post('/fetch-particular-payment-approve',isAuthenticated,authorizeRole(["admin", "state", "franchise", "bd"]),fetchParticularPaymentApprove);
module.exports = router;