const authorizeAdmin = (req, res, next) => {
  const Roles = {
    USER: 1,
    ADMIN: 2,
    Manager: 3,
  };
  if (![Roles.ADMIN, Roles.Manager].includes(req.user.roleId)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = authorizeAdmin;
