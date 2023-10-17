const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {   uplaodAdharCardBackSidePartner } = require('../controllers/adminControllers');

router.put('/upload-adhar-card-back-side-partner', upload.fields([{ name: 'adhar_back_side' }]),isAuthenticated, authorizeRole(["member", "admin"]), uplaodAdharCardBackSidePartner);



module.exports = router;