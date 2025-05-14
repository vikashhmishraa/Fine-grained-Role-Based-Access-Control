import jwt from 'jsonwebtoken';
import roles from '../config/rolesPermissions.js';

// Authenticate User
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Unauthorized: Token expired' });
      }
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Authorize Roles
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access Denied: Role '${req.user.role}' not authorized` });
    }
    next();
  };
};

// Check Specific Permissions
export const authorizePermissions = (permission) => {
  return (req, res, next) => {
    const userRolePermissions = roles[req.user.role] || [];
    if (!userRolePermissions.includes(permission)) {
      return res.status(403).json({ message: `Access Denied: Missing '${permission}' permission` });
    }
    next();
  };
};



