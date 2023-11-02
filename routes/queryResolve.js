const express = require('express');
const router = express.Router();

const { queryResolve } = require('../controllers/adminControllers');
const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');

router.post('/query-resolve',isAuthenticated, authorizeRole(["admin", "partner"]), queryResolve);



module.exports = router;