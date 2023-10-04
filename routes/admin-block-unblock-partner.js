const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { adminBlockUnblockPartner } = require('../controllers/adminControllers');

router.post('/admin-block-unblock-partner',isAuthenticated, authorizeRole([ "admin"]), adminBlockUnblockPartner);



module.exports = router;