const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {  uploadPanCardPartner } = require('../controllers/adminControllers');

router.put('/upload-pan-card-partner', upload.fields([{ name: 'panCard' }]),isAuthenticated, authorizeRole([ "member","admin"]), uploadPanCardPartner);



module.exports = router;