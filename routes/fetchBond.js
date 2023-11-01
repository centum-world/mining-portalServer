const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkAuth');
const { fetchBond } = require('../controllers/adminControllers');

router.get('/fetch-bond',checkAuthMiddleware.isAuthenticated, checkAuthMiddleware.authorizeRole(["admin"]),fetchBond);
module.exports = router;