const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { uplaodAdharCardAndPancardMember } = require('../controllers/adminControllers');

router.put('/upload-adhar-card-and-pan-card-member', upload.fields([{ name: 'adhar_front_side' },
{ name: 'adhar_back_side' }, {name: "panCard"}]),isAuthenticated, authorizeRole(["bd", "admin"]), uplaodAdharCardAndPancardMember);



module.exports = router;