const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const verifyToken = (req,res,next) => {
  let token;
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    console.log(`The Decoded user is:`, req.user);
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Token is invalid" });
  }
};

const verifyTeam = (req, res, next) => {
  const { teamId } = req.params;
  const userTeams = req.user.teams;

  const team = userTeams.find((t) => t.teamId === teamId);
  if (!team) {
    return res.status(403).json({ message: "Access denied: Not part of this team" });
  }

  req.user.currentRole = team.role; 
  next();
};




const verifySuperAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "superAdmin") {
      return res.status(403).json({ message: "Access denied: SuperAdmin only" });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error("Error in verifySuperAdmin middleware:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = {verifyToken, verifyTeam, verifySuperAdmin};
