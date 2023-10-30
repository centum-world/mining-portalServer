const express = require('express');
const router = express.Router();

const {  fetchPartnerReferWithdrawl } = require('../controllers/partnerControllers');
const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');

router.post('/fetch-partner-refer-withdral',isAuthenticated,authorizeRole(["admin", "partner"]),fetchPartnerReferWithdrawl);
module.exports = router;