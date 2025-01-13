const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    
        next();
    }
};
module.exports = authorizeRoles;
