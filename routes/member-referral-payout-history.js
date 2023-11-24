const express = require('express');
const router = express.Router();

const memberControllers = require('../controllers/memberControllers');
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post('/fetch-member-myteam-details',isAuthenticated,authorizeRole(["admin"]),memberControllers.fetchMemberMyTeam);
module.exports = router;