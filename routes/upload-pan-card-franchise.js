const express = require("express");
const router = express.Router();
const upload = require("../utils/aws");

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {
    uploadPanCardFranchise,
} = require("../controllers/adminControllers");

router.put(
  "/upload-pan-card-franchise",
  upload.fields([{ name: "panCard" }]),
  isAuthenticated,
  authorizeRole(["franchise", "admin"]),
  uploadPanCardFranchise
);

module.exports = router;
