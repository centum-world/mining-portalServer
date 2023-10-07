const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../../middleware/checkAuth');
const {  allBdDetailsReferredByFranchise } = require('../../controllers/franchiseController');

router.post('/frenchise/all-bd-details-referred-by-franchise',isAuthenticated,authorizeRole(["franchise"]),allBdDetailsReferredByFranchise);
module.exports = router;