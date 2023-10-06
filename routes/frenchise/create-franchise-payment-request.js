const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../../middleware/checkAuth');
const { franchiseAddBankDetails } = require('../../controllers/franchiseController');

router.post('/frenchise/create-franchise-payment-request',isAuthenticated,authorizeRole(["franchise"]),franchiseAddBankDetails);
module.exports = router;