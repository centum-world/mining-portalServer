const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { adminFetchAllMiningPartner } = require('../controllers/adminControllers');

router.post('/admin-fetch-all-mining-partner',isAuthenticated, authorizeRole([ "admin"]), adminFetchAllMiningPartner);



module.exports = router;