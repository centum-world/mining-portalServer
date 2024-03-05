const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { upgradeFranchiseToBMM } = require('../controllers/adminControllers');

router.post('/ugrade-franchise-to-bmm',isAuthenticated, authorizeRole(["admin"]), upgradeFranchiseToBMM);



module.exports = router;