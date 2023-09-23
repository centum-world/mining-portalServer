const express = require('express');
const router = express.Router();

const { fetchParticularSHO } = require('../controllers/stateController');
const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');

router.post('/fetch-particular-sho',isAuthenticated,authorizeRole(["admin", "state"]),fetchParticularSHO);
module.exports = router;