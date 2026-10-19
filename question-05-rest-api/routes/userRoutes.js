const userService = require('../services/userService');
const { sendJson, readJsonBody } = require('../utils/httpUtils');

async function handleRoutes(req, res) {
    const method = req.method;
    const pathname = new URL(
        req.url,
        `http://${req.headers.host || 'localhost'}`
    ).pathname;

    // GET /
    if (method === 'GET' && pathname === '/'){
        return sendJson(res, 200, {
            succes: true,
            message: 'Welcome to the Node.js HTTP server'
        });
    }

    // GET /users
    if (method === 'GET' && pathname === '/users'){
        const users = await userService.getAllUsers();

        return sendJson(res, 200, {
            success: true,
            data: users
        });
    }

    // POST /users
    if (method === 'POST' && pathname === '/users'){
        const body = await readJsonBody(req);
        const user = await userService.createUser(body);

        return sendJson(res, 201, {
            success: true,
            message: 'User created',
            data: user
        });
    }

    // GET /health
    if (method === 'GET' && pathname === '/health'){
        return sendJson(res, 200, {
            success: true,
            status: 'OK',
            message: 'Server is running'
        });
    }

    // MAtch indivisual user routes: users/:id
    const match = pathname.match(/^\/users\/([^/]+)$/);

    if(match) {
        const id = match[1];

        if (method === 'GET'){
            const user = await userService.getUserById(id);

            if(!user) {
                return sendJson(res, 404, {
                    succes: false,
                    message: 'User not found'
                });
            }
            return sendJson(res, 200, {
                succes: true,
                data: user
            });
            
        } else if (method === 'PUT'){
            const body = await readJsonBody(req);
            const user = await userService.updateUser(id, body);

            if(!user) {
                return sendJson(res, 404, {
                        success: false,
                        message: 'User not found'
                });
            }
            return sendJson(res, 200, {
                success: true,
                message: 'User updated',
                data: user
            });
        } else if (method === 'DELETE'){
            const deleted = await userService.deleteUser(id);

            if(!deleted){
                return sendJson(res, 404, {
                        success: false,
                        message: 'User not found'
                });
            }
            return sendJson(res, 200, {
                success: true,
                message: 'User deleted',
            });
        }
    }

    // known route but unsupported methods
    const knwonRoutes = ['/', '/users', 'health'];

    if (knwonRoutes.includes(pathname)){
    const allowedMethods = pathname === '/users'
        ? 'GET, POST'
        : pathname.match(/^\/users\/([^/]+)$/)
            ? 'GET, PUT, DELETE'
            : 'GET';

    return sendJson(res, 405, {
        success: false,
        error: 'Method Not Allowed',
        message: 'The HTTP method is not supported for this route'        
    }, {
        Allow: allowedMethods
    });

    }

    return sendJson(res, 404, {
        succes: false,
        error: 'Not Found',
        message: `Route ${pathname} not found`
    });
    
}

module.exports = handleRoutes;