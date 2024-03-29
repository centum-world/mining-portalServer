const express = require("express");
const router = express.Router();
const upload  = require("../utils/aws"); // Import Multer upload middleware

const { createSHO } = require("../controllers/signupControllers");


router.post("/create-sho",  upload.fields([{ name: 'adhar_front_side' },{ name: 'adhar_back_side' }, {name: "panCard"}]),createSHO);

module.exports = router;
//route