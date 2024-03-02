const express = require('express');
const connection = require('../config/database');
const router = express.Router();

const {fetchPartnerMyteamDetails} = require('../controllers/partnerControllers');
const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");

router.post('/fetch-partner-myteam-details',isAuthenticated,authorizeRole(["partner","member","franchise"]),fetchPartnerMyteamDetails);
module.exports = router;