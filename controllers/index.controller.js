

exports.getIndex = (req, res, next) => {
  console.log(req.user)
    res.render('main/dashboard', {
      user: req.user,
      csrfToken: req.csrfToken()
    });
};

exports.getUsers = (req, res, next) => {
  console.log(req.user)
    res.render('main/users', {
      user: req.user,
      csrfToken: req.csrfToken()
    });
};

// Routes
exports.getDashboard = (req, res) => {
    res.render('dashboard', { projects });
  };
  
