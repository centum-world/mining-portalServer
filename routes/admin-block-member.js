const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { adminBlockMember } = require('../controllers/adminControllers');

router.post('/admin-block-member',isAuthenticated, authorizeRole([ "admin"]), adminBlockMember);



module.exports = router;