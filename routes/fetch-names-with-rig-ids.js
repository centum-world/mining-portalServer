const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../middleware/checkAuth');
const { fetchNamesWithRigId } = require('../controllers/adminControllers');

router.post('/fetch-names-with-rig-ids',isAuthenticated,authorizeRole(["admin"]),fetchNamesWithRigId);
module.exports = router;