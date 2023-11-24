const express = require('express');
const router = express.Router();

const memberControllers = require('../controllers/memberControllers');
const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");

router.post('/fetch-member-approve-withdrawal-history-for-member',isAuthenticated,authorizeRole(["member"]),
memberControllers.fetchMemberApproveWithdrawalHistoryForMember);
module.exports = router;