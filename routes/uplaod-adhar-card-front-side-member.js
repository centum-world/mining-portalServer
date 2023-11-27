const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {  uploadAdharCardFrontSideMember } = require('../controllers/adminControllers');

router.put('/upload-adhar-card-front-side-member', upload.fields([{ name: 'adhar_front_side' }]),isAuthenticated, authorizeRole(["franchise", "admin"]), uploadAdharCardFrontSideMember);



module.exports = router;