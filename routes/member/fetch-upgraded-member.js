const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../../middleware/checkAuth');
const {  fetchUpgradedMember } = require('../../controllers/memberControllers');

router.get('/member/fetch-upgraded-member',isAuthenticated,authorizeRole(["member","admin"]),fetchUpgradedMember);
module.exports = router;