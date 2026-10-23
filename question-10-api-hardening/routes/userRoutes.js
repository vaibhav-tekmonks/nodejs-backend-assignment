const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const { readJsonBody } = require('../utils/httpUtils');
const { createError } = require('../utils/errorHandler');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

async function handleUserRoutes(req, res, pathname) {
    const isCollectionRoute = pathname === '/api/users';
    const matched = pathname.match(/^\/api\/users\/([^/]+)$/);

    if (!isCollectionRoute && !matched) {
        return false;
    }

    const allowedMethods = isCollectionRoute
        ? ['GET', 'POST']
        : ['GET', 'PUT', 'DELETE'];

    if (!allowedMethods.includes(req.method)) {
        res.setHeader('Allow', allowedMethods.join(', '));
        throw createError('Method not allowed', 405);
    }

    if (matched && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(matched[1])) {
        throw createError('User ID must be a valid UUID', 400);
    }

    const user = authenticateToken(req, res);

    if (isCollectionRoute) {
        if (req.method === 'GET') {
            return getAllUsers(req, res);
        }

        authorizeRoles(res, user, 'admin');
        const contentType = req.headers['content-type'] || '';
        if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
            throw createError('Content-Type must be application/json', 415);
        }

        const body = await readJsonBody(req);
        return createUser(req, res, body);
    }

    const id = matched[1];
    if (req.method === 'GET') {
        return getUserById(req, res, id);
    }

    authorizeRoles(res, user, 'admin');

    if (req.method === 'PUT') {
        const contentType = req.headers['content-type'] || '';
        if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
            throw createError('Content-Type must be application/json', 415);
        }

        const body = await readJsonBody(req);
        return updateUser(req, res, id, body);
    }

    return deleteUser(req, res, id);
}

module.exports = handleUserRoutes;
