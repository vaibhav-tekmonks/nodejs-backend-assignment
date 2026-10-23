const http = require('http');
const handleRoutes = require('./routes/index');
const requestLogger = require("./utils/requestLogger");
const { createError, handleError } = require("./utils/errorHandler");

require('dotenv').config();

const PORT = 3000;
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing from .env');
    process.exit(1);
}

const server = http.createServer(async (req, res) => {
    requestLogger(req, res);

    try {
        const handled = await handleRoutes(req, res);

        if (!handled) {
            throw createError('Route not found', 404);
        }
    } catch (error) {
        handleError(error, req, res);
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

server.on('error', error => {
    console.error('Server startup error:', error.message);
    process.exitCode = 1;
});
