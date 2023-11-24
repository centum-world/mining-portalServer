const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");

router.post('/fetch-member-reffer-withdrawal-request-from-admin',isAuthenticated,authorizeRole(["admin"]),
adminControllers.fetchMemberRefferWithdrawalRequestFromAdmin);
module.exports = router;