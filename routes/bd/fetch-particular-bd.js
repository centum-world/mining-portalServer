const express = require("express");
const router = express.Router();

const {  fetchParticularBd } = require("../../controllers/bdController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/fetch-particular-bd",isAuthenticated, authorizeRole(["bd"]), fetchParticularBd);

module.exports = router;
