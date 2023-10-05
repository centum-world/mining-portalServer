const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { updateMember } = require('../controllers/memberControllers');

router.put('/update-member',isAuthenticated, authorizeRole(["franchise","state", "admin", "member"]), updateMember);



module.exports = router;