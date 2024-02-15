const express = require('express');
const { fetchPartnerAndMultipleRig } = require('../controllers/partnerControllers');
const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const router = express.Router();


router.post('/fetch-partner-and-multiple-rig',isAuthenticated,authorizeRole(["partner"]),fetchPartnerAndMultipleRig);
module.exports = router;