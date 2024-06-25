const jwt = require('jsonwebtoken')
const secret = ('Swaraj@123')

function createToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    }
    const token = jwt.sign(payload, secret);
    return token;
}

function verifyToken(token) {
    return jwt.verify(token, secret);
}

module.exports = { createToken, verifyToken }

