const express = require('express');
const connection = require('../config/database');
const router = express.Router();
const memberControllers = require('../controllers/memberControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

router.post('/member-profile-details',checkAuthMiddleware.isAuthenticated,checkAuthMiddleware.authorizeRole(["member", "admin"]),memberControllers.fetchMemberDetails);

module.exports = router;