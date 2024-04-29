const express = require("express");
const router = express.Router();

const { fetchReferralWalletWithRigId } = require("../controllers/adminControllers");
const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");

router.get("/fetch-referral-wallet-with-rig-id/:rigId", isAuthenticated,
authorizeRole(["admin"]),fetchReferralWalletWithRigId)

module.exports = router;