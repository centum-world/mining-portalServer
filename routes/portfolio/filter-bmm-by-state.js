const express = require('express');
const router = express.Router();

const portfolioController = require('../../controllers/portfolioController');

router.post('/portfolio/filter-bmm-by-state',portfolioController.filterBmmByState);



module.exports = router;