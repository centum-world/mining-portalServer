const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {   uplaodAdharCardFrontSidePartner } = require('../controllers/adminControllers');

router.put('/upload-adhar-card-front-side-partner', upload.fields([{ name: 'adhar_front_side' }]),isAuthenticated, authorizeRole(["member", "admin"]), uplaodAdharCardFrontSidePartner);



module.exports = router;