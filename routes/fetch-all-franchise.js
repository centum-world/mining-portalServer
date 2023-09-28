const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { fetchAllFranchise } = require('../controllers/adminControllers');

router.get('/fetch-all-franchise',isAuthenticated,authorizeRole(["state", "admin"]),fetchAllFranchise);
module.exports = router;