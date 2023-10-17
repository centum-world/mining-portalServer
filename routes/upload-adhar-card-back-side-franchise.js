const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {  uploadAdharCardBackSideFranchise } = require('../controllers/adminControllers');

router.put('/upload-adhar-card-back-side-franchise', upload.fields([{ name: 'adhar_back_side' }]),isAuthenticated, authorizeRole(["state", "admin"]), uploadAdharCardBackSideFranchise);



module.exports = router;