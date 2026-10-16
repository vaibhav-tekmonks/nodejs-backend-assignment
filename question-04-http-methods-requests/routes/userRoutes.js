const {
    getHome,
    getUsers,
    getHealth,
    createUserHandler
} = require('../controllers/userController');
const sendJSON = require('../utils/sendJSON');

async function handleRoutes(req, res) {
    const method = req.method;
    const pathname = new URL(
        req.url,
        `http://${req.headers.host || 'localhost'}`
    ).pathname;

    // GET /
    if (method === 'GET' && pathname === '/'){
        return getHome(req, res);
    }

    // GET /users
    if (method === 'GET' && pathname === '/users'){
        return getUsers(req, res);
    }

    // POST /users
    if (method === 'POST' && pathname === '/users'){
        return createUserHandler(req, res);
    }

    // GET /health
    if (method === 'GET' && pathname === '/health'){
        return getHealth(req, res);
    }

    // known route but unsupported methods
    const knwonRoutes = ['/', '/users', 'health'];

    if (knwonRoutes.includes(pathname)){
    const allowedMethods = pathname === '/users'
        ? 'GET, POST'
        : 'GET';

    return sendJSON(res, 405, {
        success: false,
        error: 'Method Not Allowed',
        message: 'The HTTP method is not supported for this route'        
    }, {
        Allow: allowedMethods
    });

    }

    return sendJSON(res, 404, {
        succes: false,
        error: 'Not Found',
        message: `Route ${pathname} not found`
    });
    
}

module.exports = handleRoutes;