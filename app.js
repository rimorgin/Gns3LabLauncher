const express = require('express');
const path = require("path");
const cookieParser = require('cookie-parser');
const passport = require('passport');

const authRouter = require('./routes/auth.routes');
const indexRouter = require('./routes/index.routes');

const app = express();

const viewsMiddleware = require('./middlewares/views.middleware');
const ConnectMongoDB = require('./database/mongo.database');

viewsMiddleware(app);
// Initialize mongodb 
ConnectMongoDB();

app.locals.pluralize = require('pluralize');

app.use(require('./middlewares/logger.middleware'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/src/public')));

// Custom middlewares
app.use(require('./middlewares/session.middleware'));

app.use(passport.initialize());
app.use(passport.session());

//app.use(passport.authenticate('session'));

app.use(require('./middlewares/flash.middleware'));

// Flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use(require('./middlewares/messages.middleware'));
app.use(require('./middlewares/csrf.middleware'));

app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/', authRouter); // authentication routes
app.use('/', indexRouter); // main application routes

// Error handling
app.use(require('./middlewares/error.middleware').notFoundHandler);
app.use(require('./middlewares/error.middleware').errorHandler);

module.exports = app;