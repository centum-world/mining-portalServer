const express = require('express');
const router = express.Router();

const { fetchQuery } = require('../controllers/adminControllers');
const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');

router.post('/fetch-query',isAuthenticated, authorizeRole(["admin", "partner"]), fetchQuery);



module.exports = router;