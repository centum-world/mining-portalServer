const express = require('express');
const router = express.Router();
const upload  = require("../utils/aws"); 


const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const {  uploadPanCardMember } = require('../controllers/adminControllers');

router.put('/upload-pan-card-member', upload.fields([{ name: 'panCard' }]),isAuthenticated, authorizeRole(["bd", "admin"]), uploadPanCardMember);



module.exports = router;