const express = require("express");
const router = express.Router();

const {  updateBd } = require("../../controllers/bdController");
const {
  isAuthenticated,
  authorizeRole,
} = require("../../middleware/checkAuth");

router.post(
  "/update-bd",
  isAuthenticated,
  authorizeRole(["admin", "franchise", "bd"]),
  updateBd
);

module.exports = router;
