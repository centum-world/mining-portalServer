const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { fetchParticularMemberWithdrawalRequest } = require('../controllers/adminControllers');

router.post('/fetch-particular-member-withdrawal-request',isAuthenticated,authorizeRole(["admin"]),fetchParticularMemberWithdrawalRequest);
module.exports = router;