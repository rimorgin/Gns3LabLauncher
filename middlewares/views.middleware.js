const path = require('path');
const pluralize = require('pluralize');

module.exports = function viewsMiddleware(app) {
  app.set('views', path.join(__dirname, '../src/views'));
  app.set('view engine', 'ejs');
  app.locals.pluralize = pluralize;
};