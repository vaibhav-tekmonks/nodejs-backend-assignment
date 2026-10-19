const jwt = require('jsonwebtoken');
const { sendJson } = require('../utils/httpUtils');

function authenticateToken(req, res) {
    const authHeader = req.headers.authorization;
    const match = typeof authHeader === 'string'
        ? authHeader.trim().match(/^Bearer\s+(\S+)$/i)
        : null;
    // console.log(match);
    // console.log(match[1]);
    if (!match) {
        sendJson(res, 401, {
            success: false,
            message: 'Authentication token required'
        });
        return null;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        sendJson(res, 500, {
            success: false,
            message: 'Authentication is not configured'
        });
        return null;
    }

    try {
        return jwt.verify(match[1], secret);
    } catch (error) {
        sendJson(res, 401, {
            success: false,
            message: error.name === 'TokenExpiredError'
                ? 'Token expired'
                : 'Invalid token'
        });
        return null;
    }
}

function authorizeRoles(res, user, ...roles) {
    if (!roles.includes(user.role)) {
        sendJson(res, 403, {
            success: false,
            message: 'You do not have permission to perform this operation'
        });

        return false;
    }

    return true;
}

module.exports = {
    authenticateToken,
    authorizeRoles
};