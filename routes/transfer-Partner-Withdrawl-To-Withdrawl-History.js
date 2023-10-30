const express = require('express');
const { transferPartnerWithdrawlToWithdrawlHistory } = require('../controllers/partnerControllers');
const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const router = express.Router();


router.post('/transfer-Partner-Withdrawl-To-Withdrawl-History', isAuthenticated,authorizeRole(["admin"]),transferPartnerWithdrawlToWithdrawlHistory);



module.exports = router;