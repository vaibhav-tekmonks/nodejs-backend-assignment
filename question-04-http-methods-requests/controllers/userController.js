const readRequestBody = require('../utils/readRequestBody');
const sendJSON = require('../utils/sendJSON');
const validateUser = require('../validators/userValidator');
const {
    getAllUsers,
    createUser
} = require('../services/userService');

function getUsers(req, res) {
    const users = getAllUsers();
    return sendJSON(res, 200, {
        success: true,
        count: users.length,
        data: users
    });
}

async function createUserHandler(req, res) {
    const contentType = req.headers['content-type'];
    if (contentType !== 'application/json') {
        return sendJSON(res, 415, {
            success: false,
            error: 'Unsupported Media Type',
            message: 'Content-Type must be application/json'
        });
    }

    try {
        const data = await readRequestBody(req);
        const validationError = validateUser(data);

        if (validationError) {
            return sendJSON(res, 400, {
                success: false,
                error: 'Bad Request',
                message: validationError
            });
        }

        const newUser = createUser(data);
        return sendJSON(res, 201, {
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    }
    catch (error) {
        const statusCode = [400, 413].includes(error.statusCode)
            ? error.statusCode
            : 500;

        if (statusCode === 413) {
            res.statusMessage = 'Content Too Large';
        }

        return sendJSON(res, statusCode, {
            success: false,
            error: statusCode === 400
                ? 'Bad Request'
                : statusCode === 413
                    ? 'Content Too Large'
                    : 'Internal Server Error',
            message: statusCode === 400
                ? 'An unexpected server error occured'
                : error.message
        })
    }
}

function getHome(req, res) {
    return sendJSON(res, 200, {
        success: true,
        message: 'Welcome to the Node.js HTTP server'
    });
}
function getHealth(req, res) {
    return sendJSON(res, 200, {
        success: true,
        status: 'OK',
        message: 'Server is running'
    })
}

module.exports = {
    getHome,
    getHealth,
    getUsers,
    createUserHandler
}