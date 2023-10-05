const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const partnerControllers = require('../controllers/partnerControllers');
const { authorizeRole,isAuthenticated } = require('../middleware/checkAuth');
router.post('/update-partner-data',isAuthenticated,authorizeRole(["admin", "partner"]),partnerControllers.updatePartnerData);

module.exports =router;