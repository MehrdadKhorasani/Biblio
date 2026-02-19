const ROLES = {
  USER: 1,
  ADMIN: 2,
  MANAGER: 3,
};

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.roleId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!allowedRoles.includes(req.user.roleId)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  };
};

module.exports = {
  authorize,
  ROLES,
};
