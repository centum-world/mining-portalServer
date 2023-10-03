const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { verifySho } = require('../controllers/stateController');

router.post('/verify-sho',isAuthenticated, authorizeRole([ "admin"]), verifySho);



module.exports = router;