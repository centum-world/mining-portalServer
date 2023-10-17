const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {   uploadPanCardSho } = require('../controllers/adminControllers');

router.put('/upload-pan-card-sho', upload.fields([{ name: 'panCard' }]),isAuthenticated, authorizeRole([ "admin"]), uploadPanCardSho);



module.exports = router;