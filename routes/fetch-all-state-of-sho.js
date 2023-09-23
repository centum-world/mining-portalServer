const express = require('express');
const router = express.Router();

const { fetchAllStateOfSHO } = require('../controllers/stateController');
const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');

router.post('/fetch-all-state-of-sho',isAuthenticated,authorizeRole(["state"]),fetchAllStateOfSHO);
module.exports = router;