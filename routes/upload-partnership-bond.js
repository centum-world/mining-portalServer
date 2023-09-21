const express = require('express');
const multer = require('multer');
const connection = require('../config/database');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const checkAuthMiddleware = require('../middleware/checkAuth');

const upload = multer({ dest: 'uploads/' });

router.post('/upload-partnership-bond',upload.single('bondFile'),checkAuthMiddleware.checkAuth,
adminControllers.uploadPartnershipBond);
module.exports = router;