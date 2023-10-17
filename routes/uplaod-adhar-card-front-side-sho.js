const express = require("express");
const router = express.Router();
const upload = require("../utils/aws");

const { isAuthenticated, authorizeRole } = require("../middleware/checkAuth");
const {
  uplaodAdharCardFrontSideSho,
} = require("../controllers/adminControllers");

router.put(
  "/upload-adhar-card-front-side-sho",
  upload.fields([{ name: "adhar_front_side" }]),
  isAuthenticated,
  authorizeRole([ "admin"]),
  uplaodAdharCardFrontSideSho
);

module.exports = router;
