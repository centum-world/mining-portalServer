const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {  fetchAllBd } = require('../controllers/adminControllers');

router.get('/fetch-all-bd',isAuthenticated,authorizeRole([ "admin"]),fetchAllBd);
module.exports = router;