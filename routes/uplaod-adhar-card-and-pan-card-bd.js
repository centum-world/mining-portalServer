const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {  uplaodAdharCardAndPancardBd } = require('../controllers/adminControllers');

router.put('/upload-adhar-card-and-pan-card-bd', upload.fields([{ name: 'adhar_front_side' },
{ name: 'adhar_back_side' }, {name: "panCard"}]),isAuthenticated, authorizeRole(["franchise", "admin"]),uplaodAdharCardAndPancardBd);



module.exports = router;