const express = require("express");
const router = express.Router();
const upload = require("../utils/aws");

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");

const { uploadBond } = require("../controllers/adminControllers");

router.post(
  "/upload-bond",
  upload.fields([{ name: "bond" }]),
  isAuthenticated,
  authorizeRole(["franchise","bd", "state","partner", "member", "admin"]),
  uploadBond
);

module.exports = router;
