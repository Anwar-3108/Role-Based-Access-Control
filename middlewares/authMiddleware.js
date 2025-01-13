const jwt = require("jsonwebtoken");

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

module.exports = verifyToken;
