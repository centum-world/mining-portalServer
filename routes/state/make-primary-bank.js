const express = require("express");
const router = express.Router();

const { makePrimaryBank } = require("../../controllers/stateController");
const {
  isAuthenticated,
  authorizeRole,
} = require("../../middleware/checkAuth");

router.post(
  "/make-primary-bank",
  isAuthenticated,
  authorizeRole(["state","franchise", "admin"]),
  makePrimaryBank
);

module.exports = router;
//route
