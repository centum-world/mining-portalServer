const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../../middleware/checkAuth');
const { fetchFranchiseBankDetails } = require('../../controllers/franchiseController');

router.post('/frenchise/fetch-bank-details',isAuthenticated,authorizeRole(["franchise", "admin"]),fetchFranchiseBankDetails);
module.exports = router;