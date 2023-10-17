const express = require("express");
const router = express.Router();
const upload = require("../utils/aws");

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {
   uploadPanCardBd,
} = require("../controllers/adminControllers");

router.put(
  "/upload-pan-card-bd",
  upload.fields([{ name: "panCard" }]),
  isAuthenticated,
  authorizeRole(["franchise", "admin"]),
  uploadPanCardBd
);

module.exports = router;
