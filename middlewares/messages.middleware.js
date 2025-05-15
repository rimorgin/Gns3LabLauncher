module.exports = function messagesMiddleware(req, res, next) {
  // Handle messages
  const msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = msgs.length > 0;
  req.session.messages = [];

  // Handle toasts
  const toasts = req.session.toasts || [];
  res.locals.toasts = toasts;
  res.locals.hasToasts = toasts.length > 0;
  req.session.toasts = [];

  // Add flash() function to req
  req.flash = function (type, message) {
    if (!req.session[type]) {
      req.session[type] = [];
    }
    req.session[type].push(message);
  };

  // Proceed to the next middleware
  next();
};