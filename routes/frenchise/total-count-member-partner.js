const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../../middleware/checkAuth');

const { totalCountMemberPartner } = require('../../controllers/franchiseController');

router.post('/franchise/total-count-member-partner',isAuthenticated,authorizeRole(["franchise"]),totalCountMemberPartner);
module.exports = router;