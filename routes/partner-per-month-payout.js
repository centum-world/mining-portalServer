const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { partnerPerMonthPayout } = require('../controllers/adminControllers');

router.post('/partner-per-month-payout',isAuthenticated, authorizeRole([ "admin"]), partnerPerMonthPayout);



module.exports = router;