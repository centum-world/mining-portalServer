const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

const { verifyFranchise } = require('../controllers/franchiseController');
const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');

router.post('/verify-franchise',isAuthenticated, authorizeRole(["state", "admin"]), verifyFranchise);



module.exports = router;