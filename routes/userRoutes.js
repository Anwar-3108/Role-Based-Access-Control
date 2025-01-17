const express = require("express");
const router = express.Router();
const { verifyToken, verifyTeam } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");



// Only admin can access this route

router.get(
  "/admin",
  verifyToken,
  verifyTeam,
  authorizeRoles("admin"),
  (req, res) => {
    res.json("Welcome Admin!");
  }
);

// Admin and manager can access this route
router.get(
  "/team/:teamId/admin",
  verifyToken,
  verifyTeam,
  authorizeRoles("admin"),
  (req, res) => {
    res.json(`Welcome Admin of Team ${req.params.teamId}!`);
  }
);

// All can access this route


router.get(
  "/user",
  verifyToken,
  authorizeRoles("admin", "manager", "user"),
  (req, res) => {
    res.json("Welcome User!");
  }
);

module.exports = router;
