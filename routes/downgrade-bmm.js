const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const { authorizeRole, isAuthenticated } = require('../middleware/checkAuth');
router.post('/downgrade-bmm',isAuthenticated,authorizeRole(["admin"]),adminControllers.downgradeBmm);

module.exports =router;