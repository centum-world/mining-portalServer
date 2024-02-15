const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkAuth');
const { fetchBond } = require('../controllers/adminControllers');

router.post('/fetch-bond',checkAuthMiddleware.isAuthenticated, checkAuthMiddleware.authorizeRole(["admin", "partner"]),fetchBond);
module.exports = router;