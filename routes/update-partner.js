const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { updatePartner } = require('../controllers/partnerControllers');

router.put('/update-partner',isAuthenticated, authorizeRole(["state", "admin", "partner"]), updatePartner);



module.exports = router;