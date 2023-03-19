const express = require('express');

const router = express.Router();

const memberControllers = require('../controllers/memberControllers');
router.post('/member-regenerate-password',memberControllers.memberRegeneratePassword);


module.exports = router;