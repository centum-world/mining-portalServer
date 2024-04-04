const express = require("express");
const router = express.Router();

const checkAuthMiddleware = require("../middleware/checkAuth");
const {
   findPhoneByLastThreeDigitRigId,
} = require("../controllers/adminControllers");
router.post(
  "/find-phone-last-three-digit-rig-id",
  checkAuthMiddleware.isAuthenticated,
  checkAuthMiddleware.authorizeRole(["admin"]),
  findPhoneByLastThreeDigitRigId
);
module.exports = router;
