const express = require("express");
const router = express.Router();
const upload  = require("../utils/aws"); // Import Multer upload middleware

const {  createBd } = require("../controllers/signupControllers");

router.post("/create-bd",  upload.fields([{ name: 'adhar_front_side' },
{ name: 'adhar_back_side' }, {name: "panCard"}]), createBd);

module.exports = router;
//route