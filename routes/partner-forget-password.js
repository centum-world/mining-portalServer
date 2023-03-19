const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

const partnerControllers = require('../controllers/partnerControllers');

router.post('/partner-forget-password',partnerControllers.partnerForgetPassword);



module.exports = router;