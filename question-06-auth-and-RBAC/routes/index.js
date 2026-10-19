const { sendJson } = require('../utils/httpUtils');
const handleAuthRoutes = require('./authRoutes');
const handleUserRoutes = require('./userRoutes');

async function handleRoutes(req, res) {
    const url = new URL(
        req.url,
        `http://${req.headers.host || 'localhost'}`
    );
    const pathname = url.pathname;

    if (pathname === '/') {
        if (req.method !== 'GET') {
            sendJson(res, 405, {
                success: false,
                message: 'Method not allowed'
            }, {
                Allow: 'GET'
            });
            return;
        }

        sendJson(res, 200, {
            success: true,
            message: 'Welcome to the Node.js HTTP server'
        });
        return;
    }

    // Authenticating routes first
    if (await handleAuthRoutes(req, res, pathname)){
        return;
    }
    // User CRUD routes
    if(await handleUserRoutes(req, res, pathname)){
        return;
    }

    sendJson(res, 404, {
        success: false,
        message: 'Endpoint not found'
    });
}

module.exports = handleRoutes;