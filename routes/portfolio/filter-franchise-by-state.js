const express = require('express');
const router = express.Router();

const portfolioController = require('../../controllers/portfolioController');

router.post('/portfolio/filter-franchise-by-state',portfolioController.filterFranchiseByState);



module.exports = router;