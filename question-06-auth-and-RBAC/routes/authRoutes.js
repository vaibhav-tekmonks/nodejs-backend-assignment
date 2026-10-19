const login = require('../services/authService');
const { sendJson, readJsonBody } = require('../utils/httpUtils');

async function handleAuthRoutes(req, res, pathname) {
    if (pathname !== '/login') {
        return false;
    }

    if (req.method != 'POST') {
        res.setHeader('Allow', 'POST');

        sendJson(res, 405, {
            success: false,
            message: 'Method not allowed'
        });
        return true;
    }

    const body = await readJsonBody(req);

    if(!body || 
        typeof body.email !== 'string' ||
        typeof body.password !== 'string' ||
        !body.password
    ) {
        sendJson(res, 400, {
            success: false,
            message: 'Email and Password are required'
        });
        return true;
    }

    const token = await login(
        body.email,
        body.password
    );
    if(!token){
        sendJson(res, 401, {
            success: false,
            message: 'Invalid email or password'
        });
        return true;
    }

    sendJson(res, 200, {
        success: true,
        message: 'Login Successful',
        token
    });
    return true;
}

module.exports = handleAuthRoutes;