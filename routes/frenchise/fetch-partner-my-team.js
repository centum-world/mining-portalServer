const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../../middleware/checkAuth');
const { fetchPartnerMyTeam } = require('../../controllers/franchiseController');

router.post('/frenchise/fetch-partner-my-team',isAuthenticated,authorizeRole(["franchise"]),fetchPartnerMyTeam);
module.exports = router;