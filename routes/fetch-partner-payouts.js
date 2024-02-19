const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { fetchPartnerPayouts } = require('../controllers/adminControllers');

router.post('/fetch-partner-payouts',isAuthenticated,authorizeRole(["admin", "partner"]),fetchPartnerPayouts);
module.exports = router;