const userService = require('../services/userService');
const { sendJson, readJsonBody } = require('../utils/httpUtils');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/auth');

async function handleUserRoutes(req, res, pathname) {
    // const method = req.method;
    // const pathname = new URL(
    //     req.url,
    //     `http://${req.headers.host || 'localhost'}`
    // ).pathname;

    // if requested route is not for user crud, return false
    if (
        pathname !== '/users' &&
        !pathname.startsWith('/users/')
    ) return false;

    const loggedInUser = authenticateToken(req, res);

    if(!loggedInUser){
        return true;
    }

    // GET /
    if (req.method === 'GET' && pathname === '/'){
        sendJson(res, 200, {
            succes: true,
            message: 'Welcome to the Node.js HTTP server'
        });
        return true;
    }

    // GET /users
    if (req.method === 'GET' && pathname === '/users'){
        const users = await userService.getAllUsers();

        sendJson(res, 200, {
            success: true,
            data: users
        });

        return true;
    }

    // POST /users -> admin only
    if (req.method === 'POST' && pathname === '/users'){
        if (!authorizeRoles(res, loggedInUser, 'admin')){
            return true;
        }

        const body = await readJsonBody(req);
        const user = await userService.createUser(body);

        sendJson(res, 201, {
            success: true,
            message: 'User created',
            data: user
        });

        return true;
    }

    // MAtch indivisual user routes: users/:id
    const match = pathname.match(/^\/users\/([^/]+)$/);

    if(match) {
        const id = match[1];

        if (req.method === 'GET'){
            const user = await userService.getUserById(id);

            if(!user) {
                sendJson(res, 404, {
                    succes: false,
                    message: 'User not found'
                });
                return true;
            }
            sendJson(res, 200, {
                succes: true,
                data: user
            });
            return true;
            
        } else if (method === 'PUT'){  //->admin only
            if (!authorizeRoles(res, loggedInUser, 'admin')){
                return true;
            }
            const body = await readJsonBody(req);
            const user = await userService.updateUser(id, body);

            if(!user) {
                sendJson(res, 404, {
                    success: false,
                    message: 'User not found'
                });
                return true;
            }
            sendJson(res, 200, {
                success: true,
                message: 'User updated',
                data: user
            });
            return true;
        } else if (method === 'DELETE'){ // admin only
            if (!authorizeRoles(res, loggedInUser, 'admin')){
                return true;
            }
            const deleted = await userService.deleteUser(id);

            if(!deleted){
                sendJson(res, 404, {
                    success: false,
                    message: 'User not found'
                });
                return true;
            }
            sendJson(res, 200, {
                success: true,
                message: 'User deleted',
            });
            return true;
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

    sendJson(res, 405, {
        success: false,
        error: 'Method Not Allowed',
        message: 'The HTTP method is not supported for this route'        
    }, {
        Allow: allowedMethods
    });
    return true;

    }

    sendJson(res, 404, {
        succes: false,
        error: 'Not Found',
        message: `Route ${pathname} not found`
    });
    return true;
}

module.exports = handleUserRoutes;