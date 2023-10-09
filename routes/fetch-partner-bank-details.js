const express = require('express');
const router = express.Router();

const { fetchPartnerBankDetails } = require('../controllers/partnerControllers');
const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');

router.post('/fetch-partner-bank-details',isAuthenticated,authorizeRole(["admin", "partner"]),fetchPartnerBankDetails);
module.exports = router;