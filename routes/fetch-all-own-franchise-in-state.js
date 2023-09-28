const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { fetchAllOwnFranchiseInState} = require('../controllers/stateController');

router.post('/fetch-all-own-franchise-in-state',fetchAllOwnFranchiseInState);
module.exports = router;