const express = require("express");
const router = express.Router();

const {  fetchPrimarybank } = require("../../controllers/stateController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/state/fetch-primary-bank", isAuthenticated,authorizeRole(["state","admin", "franchise"]), fetchPrimarybank)

module.exports = router;
//route