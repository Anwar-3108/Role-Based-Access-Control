
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const checkSuperAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];  

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "superAdmin") {
      return res.status(403).json({ message: "You must be a super admin to create a team" });
    }

    next();
  } catch (error) {
    console.error("Authorization error:", error.message);
    res.status(403).json({ message: "Unauthorized" });
  }
};

module.exports = checkSuperAdmin;
