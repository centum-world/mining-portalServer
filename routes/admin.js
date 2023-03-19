const express = require('express');
const connection = require('../config/database');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminControllers = require('../controllers/adminControllers');

router.post('/login',adminControllers.adminLogin);


module.exports = router;