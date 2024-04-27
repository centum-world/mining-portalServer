const express = require("express");
const connection = require("../config/database");
const router = express.Router();

const adminControllers = require("../controllers/adminControllers");
const checkAuthMiddleware = require("../middleware/checkAuth");

router.post(
  "/partners-rig-inside-referral-in-admin",
  checkAuthMiddleware.checkAuth,
  adminControllers.partnersRigInsideReferralInAdmin
);
module.exports = router;
