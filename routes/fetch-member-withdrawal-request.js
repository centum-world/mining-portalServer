const express = require('express');
const router = express.Router();

const memberControllers = require('../controllers/memberControllers');
const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
router.post('/fetch-member-withdrawal-request',isAuthenticated,authorizeRole(["member"]),memberControllers.fetchMemberWithdrawalRequest);
module.exports = router;