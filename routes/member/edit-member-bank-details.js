const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../../middleware/checkAuth');
const { editMemberBankDetails } = require('../../controllers/memberControllers');

router.put('/member/edit-member-bank-details',isAuthenticated,authorizeRole(["member", "franchise", "state", "admin", "partner"]),editMemberBankDetails);
module.exports = router;