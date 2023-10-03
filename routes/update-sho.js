const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { updateSho } = require('../controllers/stateController');

router.put('/update-sho',isAuthenticated, authorizeRole(["state", "admin"]), updateSho);



module.exports = router;