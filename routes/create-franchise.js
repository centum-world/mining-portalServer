const express = require("express");
const router = express.Router();
const upload  = require("../utils/aws"); // Import Multer upload middleware

const { createFranchise } = require("../controllers/signupControllers");

router.post("/create-franchise",  upload.fields([{ name: 'adhar_front_side' },
{ name: 'adhar_back_side' }, {name: "panCard"}]), createFranchise);

module.exports = router;
//route