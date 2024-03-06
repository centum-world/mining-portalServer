const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {   upgradeMemberToFranchise } = require('../controllers/adminControllers');

router.post('/ugrade-member-to-franchise',isAuthenticated, authorizeRole(["admin"]), upgradeMemberToFranchise);



module.exports = router;