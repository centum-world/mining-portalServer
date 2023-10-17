const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { uploadAdharCardBackSideMember } = require('../controllers/adminControllers');

router.put('/upload-adhar-card-back-side-member', upload.fields([{ name: 'adhar_back_side' }]),isAuthenticated, authorizeRole(["bd", "admin"]), uploadAdharCardBackSideMember);



module.exports = router;