const express = require('express');
const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkAuth');
const { fetchMemberLastThreeMonthsTarget } = require('../controllers/adminControllers');

router.post('/fetch-member-last-three-months-target',
checkAuthMiddleware.isAuthenticated,checkAuthMiddleware.authorizeRole(["admin"]),fetchMemberLastThreeMonthsTarget);
module.exports = router;