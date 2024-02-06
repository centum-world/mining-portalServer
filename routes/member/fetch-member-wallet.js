const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../../middleware/checkAuth');
const {  fetchMemberWallet } = require('../../controllers/memberControllers');

router.post('/member/fetch-member-wallet',isAuthenticated,authorizeRole(["member","admin"]),fetchMemberWallet);
module.exports = router;