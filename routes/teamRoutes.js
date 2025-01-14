// routes/teamRoutes.js
const express = require("express");
const router = express.Router();
const { createTeam } = require("../controllers/teamController");
const { verifySuperAdmin } = require("../middlewares/authMiddleware");

// only accessible by super admins
router.post("/create-team", verifySuperAdmin, createTeam);

module.exports = router;
