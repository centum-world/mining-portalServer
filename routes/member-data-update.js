const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const memberControllers = require('../controllers/memberControllers');
router.post('/update-member-data',memberControllers.memberDataUpdate);

module.exports =router;