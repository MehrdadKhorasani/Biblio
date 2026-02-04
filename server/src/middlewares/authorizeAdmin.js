const authorizeAdmin = (req, res, next) => {
  const Roles = {
    USER: 1,
    ADMIN: 2,
    Manager: 3,
  };
  if (req.user.roleId !== Roles.ADMIN) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

module.exports = authorizeAdmin;
