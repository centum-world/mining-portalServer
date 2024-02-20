const express = require("express");
const router = express.Router();
const upload = require("../utils/aws");

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");

const { uploadBond } = require("../controllers/adminControllers");

router.put(
  "/upload-bond",
  upload.fields([{ name: "bond"}, {name: "invoice" }]),
  isAuthenticated,
  authorizeRole(["admin"]),
  uploadBond
);

module.exports = router;
