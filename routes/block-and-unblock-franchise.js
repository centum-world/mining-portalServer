const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const { blockAndUnblockFranchise } = require("../controllers/adminControllers");

router.post("/block-and-unblock-franchise", isAuthenticated,authorizeRole(["admin","state"]), blockAndUnblockFranchise)

module.exports = router;
