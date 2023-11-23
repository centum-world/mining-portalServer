const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../../middleware/checkAuth');
const {  memberWithdrawalRequest } = require('../../controllers/memberControllers');

router.post('/member/member-withdrawal-request',memberWithdrawalRequest);
module.exports = router;