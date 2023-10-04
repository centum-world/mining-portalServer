const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { adminVerifyPartner } = require('../controllers/adminControllers');

router.post('/admin-verify-partner',isAuthenticated, authorizeRole([ "admin"]), adminVerifyPartner);



module.exports = router;