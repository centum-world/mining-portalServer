const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../../middleware/checkAuth');
const { franchiseFetchPartnerMyTeam } = require('../../controllers/franchiseController');

router.post('/frenchise/franchise-fetch-partner-my-team',isAuthenticated,authorizeRole(["franchise"]),franchiseFetchPartnerMyTeam);
module.exports = router;