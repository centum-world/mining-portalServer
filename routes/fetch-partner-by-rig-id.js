const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { fetchPartnerByRigId } = require('../controllers/adminControllers');

router.post('/fetch-partner-by-rig-id',isAuthenticated,authorizeRole(["admin", "partner"]),fetchPartnerByRigId);
module.exports = router;