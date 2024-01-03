const express = require('express');
const router = express.Router();

const portfolioController = require('../../controllers/portfolioController');

router.get('/portfolio/fetch-all-franchise',portfolioController.fetchAllFranchiseFromPortfolio);



module.exports = router;