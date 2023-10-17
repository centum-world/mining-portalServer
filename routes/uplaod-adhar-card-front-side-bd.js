const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {   uploadAdharCardFrontSideBd } = require('../controllers/adminControllers');

router.put('/upload-adhar-card-front-side-bd', upload.fields([{ name: 'adhar_front_side' }]),isAuthenticated, authorizeRole(["franchise", "admin"]),uploadAdharCardFrontSideBd);



module.exports = router;