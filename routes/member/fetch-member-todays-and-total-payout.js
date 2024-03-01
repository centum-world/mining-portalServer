const express = require("express");
const router = express.Router();

const {  fetchMemberTodaysAndTotalPayout } = require("../../controllers/memberControllers");
const { isAuthenticated, authorizeRole } = require("../../middleware/checkAuth");

router.post("/member/fetch-member-todays-and-total-payout",isAuthenticated,authorizeRole(["member","franchise","state"]), fetchMemberTodaysAndTotalPayout)

module.exports = router;