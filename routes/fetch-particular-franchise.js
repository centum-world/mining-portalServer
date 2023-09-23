const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole, checkAuth } = require('../middleware/checkAuth');
const { fetchParticularFranchise } = require('../controllers/franchiseController');

router.post('/fetch-particular-franchise',checkAuth,fetchParticularFranchise);
module.exports = router;