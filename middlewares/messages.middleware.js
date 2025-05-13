module.exports = function messagesMiddleware(req, res, next) {
    const msgs = req.session.messages || [];
        res.locals.messages = msgs;
        res.locals.hasMessages = !!msgs.length;
        req.session.messages = [];
        next();
};