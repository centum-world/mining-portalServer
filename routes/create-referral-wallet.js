const express = require('express');
const router = express.Router();


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {  createReferralWallet } = require('../controllers/adminControllers');



router.post('/create-referral-wallet',isAuthenticated,authorizeRole(["admin"]),createReferralWallet);

module.exports = router;