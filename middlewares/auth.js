const { verifyToken } = require("../service/auth");

function checkAuth(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next();
        }
        try {
            const userPayload = verifyToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) { }
        next();
    };
}

module.exports = { checkAuth };
