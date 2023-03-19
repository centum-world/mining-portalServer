const express = require('express');
const connection = require('../config/database');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const memberControllers = require('../controllers/memberControllers');


router.post('/member-login',memberControllers.memberLogin);


module.exports = router;