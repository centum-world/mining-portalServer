const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {   uploadAdharCardBackSideSho } = require('../controllers/adminControllers');

router.put('/upload-adhar-card-back-side-sho', upload.fields([{ name: 'adhar_back_side' }]),isAuthenticated, authorizeRole([ "admin"]), uploadAdharCardBackSideSho);



module.exports = router;