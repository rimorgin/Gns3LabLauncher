const Permissions = require('../models/permissions.model');

exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return res.redirect('/');
  }
  return res.render('home')
};

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