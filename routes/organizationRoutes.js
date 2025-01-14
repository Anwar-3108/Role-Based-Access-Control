const express = require("express");
const { createOrganization } = require("../controllers/createOrganizationControllers");
const { verifySuperAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create organization route
router.post("/create-organization", verifySuperAdmin, createOrganization);

module.exports = router;
