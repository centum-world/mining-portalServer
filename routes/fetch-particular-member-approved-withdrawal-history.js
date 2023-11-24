const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { fetchParticularMemberApprovedWithdrawalHistory } = require('../controllers/adminControllers');

router.post('/fetch-particular-member-approved-withdrawal-history',isAuthenticated,authorizeRole(["admin","member"]),fetchParticularMemberApprovedWithdrawalHistory);
module.exports = router;