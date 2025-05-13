

exports.getIndex = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.render('home')
    }

    res.render('index', {
        user: req.user,
        csrfToken: req.csrfToken()
    });
};


// Routes
exports.getDashboard = (req, res) => {
    const projects = [
      {
        title: 'Theme development',
        description: 'Preparing framework of block-based WordPress Theme.',
        progress: 25,
        priority: 'High',
        team: ['avatar1.png', 'avatar2.png', 'avatar3.png'],
      },
      // Add more projects...
    ];
    if (!req.isAuthenticated()) {
        return res.render('home')
    }
    res.render('dashboard', { projects });
  };
  
