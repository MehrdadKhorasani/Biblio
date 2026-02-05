const ROLES = {
  USER: 1,
  ADMIN: 2,
  MANAGER: 3,
};

const authorizeManager = (req, res, next) => {
  try {
    if (!req.user || !req.user.roleId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (req.user.roleId !== ROLES.MANAGER) {
      return res.status(403).json({
        message: "Manager access only",
      });
    }

    next();
  } catch (error) {
    console.error("Authorize manager error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = authorizeManager;
