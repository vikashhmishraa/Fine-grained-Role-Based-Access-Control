import User from "../models/users.model.js";

const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    const userId = req.user.id; // assume JWT or session gives this

    const user = await User.findById(userId).populate({
      path: "role",
      populate: { path: "permissions" },
    });

    if (!user || !user.role) {
      return res.status(403).json({ message: "Role not assigned" });
    }

    const hasPermission = user.role.permissions.some(
      (perm) => perm.name === requiredPermission
    );

    if (!hasPermission) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  };
};

module.exports = authorize;
