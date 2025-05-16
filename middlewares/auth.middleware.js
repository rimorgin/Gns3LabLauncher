const roles = require('../configs/roles.config.json');

exports.checkAuthentication = (req, res, next) => {
  if (!req.isAuthenticated()) {
      return res.redirect('/auth/login');
  }
  next();
};

/*
// Check if the user has the required permission for a route
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user ? req.user.role : 'anonymous';
    const userPermissions = new Permissions().getPermissionsByRoleName(userRole);

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      req.session.messages = ['Forbidden: You do not have permission to access this resource.'];
      return res.redirect('/');
    }
  };
};
*/

exports.checkPermission = (requiredPermissions)=>{
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles[userRole] || !requiredPermissions.every(perm => roles[userRole].includes(perm))) {
      return req.session.messages = ['Forbidden: You do not have permission to access this resource.'];
    }
    next();
  };
};