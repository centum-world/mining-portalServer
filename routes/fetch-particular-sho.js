const express = require('express');
const router = express.Router();

const { fetchParticularSHO } = require('../controllers/stateController');
const { isAuthenticated, authorizeRole, checkAuth } = require('../middleware/checkAuth');

router.post('/fetch-particular-sho',checkAuth,fetchParticularSHO);
module.exports = router;