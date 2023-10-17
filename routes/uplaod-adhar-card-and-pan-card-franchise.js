const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {  uplaodAdharCardAndPancardFranchise } = require('../controllers/adminControllers');

router.put('/upload-adhar-card-and-pan-card-franchise', upload.fields([{ name: 'adhar_front_side' },
{ name: 'adhar_back_side' }, {name: "panCard"}]),isAuthenticated, authorizeRole(["state", "admin"]), uplaodAdharCardAndPancardFranchise);



module.exports = router;