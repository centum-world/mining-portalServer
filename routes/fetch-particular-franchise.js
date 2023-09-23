const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { fetchParticularFranchise } = require('../controllers/franchiseController');

router.post('/fetch-particular-franchise',isAuthenticated,authorizeRole(["admin", "franchise"]),fetchParticularFranchise);
module.exports = router;