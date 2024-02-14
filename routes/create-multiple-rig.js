const express = require('express');
const router = express.Router();

const { createMultipleRig } = require('../controllers/signupControllers');
const upload = require('../utils/aws');
const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');



router.post('/create-multiple-rig',upload.fields([{ name: 'adhar_front_side' },{ name: 'adhar_back_side' }, {name: "panCard"}]),isAuthenticated,authorizeRole(["partner"]),createMultipleRig);

module.exports = router;