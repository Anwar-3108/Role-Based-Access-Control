const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.currentRole)) {
        return res.status(401).json({ message: "Unauthorized: Insufficient permissions" });
      }
      next();
    };
  };
  
module.exports = authorizeRoles;
