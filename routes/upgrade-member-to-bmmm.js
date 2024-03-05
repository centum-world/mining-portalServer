const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {  upgradeMemberToBMM } = require('../controllers/adminControllers');

router.post('/ugrade-member-to-bmm',isAuthenticated, authorizeRole(["admin"]), upgradeMemberToBMM);



module.exports = router;