
const handleAuthRoutes = require("./authRoutes");
const handleUserRoutes = require("./userRoutes");
const { sendJson } = require('../utils/httpUtils');
const { createError } = require('../utils/errorHandler');

async function handleRoutes(req, res) {
    const url = new URL(
        req.url,
        `http://${req.headers.host || 'localhost'}`
    );
    const pathname = url.pathname;

    if (pathname === '/') {
        if (req.method !== 'GET') {
            res.setHeader('Allow', 'GET');
            throw createError('Method not allowed', 405);
        }

        sendJson(res, 200, {
            success: true,
            message: 'Welcome to the Node.js HTTP server'
        });
        return;
    }
    if (await handleAuthRoutes(req, res, pathname)) {
        return true;
    }

    if (await handleUserRoutes(req, res, pathname)) {
        return true;
    }

    return false;
}

module.exports = handleRoutes;
