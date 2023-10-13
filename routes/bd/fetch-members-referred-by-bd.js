const express = require("express");
const router = express.Router();

const {  fetchMembersReferredByBd } = require("../../controllers/bdController");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/fetch-members-referred-by-bd",isAuthenticated, authorizeRole(["bd"]), fetchMembersReferredByBd);

module.exports = router;
