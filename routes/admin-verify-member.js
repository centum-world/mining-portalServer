const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { adminVerifyMember } = require('../controllers/adminControllers');

router.post('/admin-verify-member',isAuthenticated, authorizeRole([ "admin"]), adminVerifyMember);



module.exports = router;