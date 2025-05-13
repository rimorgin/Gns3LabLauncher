

exports.getIndex = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.render('home')
    }

    res.render('dashboard', {
        user: req.user.username,
        role: req.user.role,
        csrfToken: req.csrfToken()
    });
};


// Routes
exports.getDashboard = (req, res) => {

    if (!req.isAuthenticated()) {
        return res.render('home')
    }
    res.render('dashboard', { projects });
  };
  
