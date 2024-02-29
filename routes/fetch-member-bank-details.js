const express = require('express');
const router = express.Router();
const {fetchMemberBankDetails} = require('../controllers/memberControllers');
const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
router.post('/fetch-member-bank-details',isAuthenticated,authorizeRole(["admin","franchise" ,"member", "state", "partner"]),fetchMemberBankDetails);
module.exports = router;