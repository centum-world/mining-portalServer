const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { verifyMultipleRigPartner } = require('../controllers/adminControllers');

router.post('/verify-multiple-rig-partner',isAuthenticated, authorizeRole(["admin"]), verifyMultipleRigPartner);



module.exports = router;