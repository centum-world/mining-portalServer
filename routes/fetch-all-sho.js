const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { fetchAllSho } = require('../controllers/adminControllers');

router.get('/fetch-all-sho',isAuthenticated,authorizeRole(["admin"]), fetchAllSho);
module.exports = router;