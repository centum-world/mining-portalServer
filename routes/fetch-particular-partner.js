const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { fetchParticularPartner } = require('../controllers/partnerControllers');

router.post('/fetch-particular-partner',isAuthenticated,authorizeRole(["admin", "partner"]),fetchParticularPartner);
module.exports = router;