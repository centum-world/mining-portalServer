const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const memberControllers = require('../controllers/memberControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');
router.post('/member-bank-details',checkAuthMiddleware.checkAuth,memberControllers.addMemberBankDetails);


module.exports = router;