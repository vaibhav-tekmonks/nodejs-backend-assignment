const jwt = require('jsonwebtoken');
const { createError } = require('../utils/errorHandler');

function authenticateToken(req, res) {
    const authHeader = req.headers.authorization;
    const match = typeof authHeader === 'string'
        ? authHeader.trim().match(/^Bearer\s+(\S+)$/i)
        : null;
    if (!match) {
        throw createError('Authentication token required', 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw createError('Authentication is not configured', 500);
    }

    try {
        return jwt.verify(match[1], secret);
    } catch (error) {
        // sendJson(res, 401, {
        //     success: false,
        //     message: error.name === 'TokenExpiredError'
        //         ? 'Token expired'
        //         : 'Invalid token'
        // });
        throw createError(error.name === 'TokenExpiredError'
            ? 'Token expired'
            : 'Invalid token', 401);
    }
}

function authorizeRoles(res, user, ...roles) {
    if (!roles.includes(user.role)) {
        // sendJson(res, 403, {
        //     success: false,
        //     message: 'You do not have permission to perform this operation'
        // });
        throw createError('You do not have permission to perform this operation', 403);
    }

    return true;
}

module.exports = {
    authenticateToken,
    authorizeRoles
};