const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      // Get the user's role name from the role association
      const userRole = req.user.role ? req.user.role.name : null;
      const userStatus = req.user.user_status ? req.user.user_status.status : null;
      
      // Check if user is active (approved status)
      if (userStatus !== 'approved') {
        return res.status(403).json({ 
          error: "Account not approved. Please contact administrator." 
        });
      }
      
      if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({ error: "Access denied" });
      }
      next();
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
};

module.exports = {
  authorizeRoles
};