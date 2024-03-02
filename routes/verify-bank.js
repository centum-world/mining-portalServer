const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { verifyBank } = require('../controllers/adminControllers');

router.get('/verify-bank/:id',isAuthenticated, authorizeRole(["admin"]), verifyBank);



module.exports = router;