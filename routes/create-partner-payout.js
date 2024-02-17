const express = require('express');
const router = express.Router();


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { createPartnerPayout } = require('../controllers/adminControllers');



router.post('/create-partner-payout',isAuthenticated,authorizeRole(["admin"]),createPartnerPayout);

module.exports = router;