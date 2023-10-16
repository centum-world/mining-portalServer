const express = require('express');
const router = express.Router()
const upload  = require("../utils/aws"); 



const signupController = require('../controllers/signupControllers');

router.post('/member-signup',upload.fields([{ name: 'adhar_front_side' },{ name: 'adhar_back_side' }, {name: "panCard"}]),signupController.memberSignup);


module.exports = router;

