const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const memberControllers = require('../controllers/memberControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/member-bank-details',checkAuthMiddleware.isAuthenticated, checkAuthMiddleware.authorizeRole(["member", "franchise", "state", "partner", "admin"]),memberControllers.addMemberBankDetails);


module.exports = router;