const express = require("express");
const router = express.Router();

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {  blockAndUnblockSho } = require("../controllers/adminControllers");

router.post("/block-and-unblock-sho", isAuthenticated,authorizeRole(["admin"]), blockAndUnblockSho)

module.exports = router;
