const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {  uplaodAdharCardFrontSideFranchise } = require('../controllers/adminControllers');

router.put('/upload-adhar-card-front-side-franchise', upload.fields([{ name: 'adhar_front_side' }]),isAuthenticated, authorizeRole(["state", "admin"]), uplaodAdharCardFrontSideFranchise);



module.exports = router;