const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const { authorizeRole, isAuthenticated } = require('../middleware/checkAuth');
router.post('/downgrade-franchise',isAuthenticated,authorizeRole(["admin"]),adminControllers.downgradeFranchise);

module.exports =router;