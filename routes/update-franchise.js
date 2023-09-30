const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { updateFranchise } = require('../controllers/franchiseController');

router.put('/update-franchise',isAuthenticated, authorizeRole(["franchise","state", "admin"]), updateFranchise);



module.exports = router;