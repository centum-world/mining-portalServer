const express = require('express');
const router = express.Router();

const { isAuthenticated, authorizeRole } = require('../../middleware/checkAuth');
const { fetchTotalWithdrawal } = require('../../controllers/franchiseController');

router.post('/frenchise/fetch-total-withdrawal',isAuthenticated,authorizeRole(["franchise","state"]),fetchTotalWithdrawal);
module.exports = router;