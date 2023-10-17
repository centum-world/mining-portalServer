const express = require("express");
const router = express.Router();
const upload = require("../utils/aws");

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {
  uploadAdharCardBackSideBd,
} = require("../controllers/adminControllers");

router.put(
  "/upload-adhar-card-back-side-bd",
  upload.fields([{ name: "adhar_back_side" }]),
  isAuthenticated,
  authorizeRole(["franchise", "admin"]),
  uploadAdharCardBackSideBd
);

module.exports = router;
