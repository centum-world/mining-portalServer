const express = require('express');
//const connection = require('../config/database');
const router = express.Router();

const partnerControllers = require('../controllers/partnerControllers');

router.post('/partner-Regenerate-Password',partnerControllers.partnerRegeneratePassword);



module.exports = router;