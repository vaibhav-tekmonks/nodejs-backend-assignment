const http = require('http');
const handleRoutes = require('./routes/index');
const {sendJson} = require('./utils/httpUtils');
require('dotenv').config();

const PORT = 3000;
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing from .env');
    process.exit(1);
}

const server = http.createServer(async (req, res) => {
    console.log(
        `${req.method} ${req.url} | ` +
        `Content-Type: ${req.headers['content-type'] || 'not provided'} | ` +
        `Accept: ${req.headers.accept || 'not provided'}`
    );

    try {
        await handleRoutes(req, res);
    } catch (error) {
        console.error(error.message);

        return sendJson(res, error.statusCode || 500, {
            success: false,
            message: error.statusCode
                ? error.message
                : 'Internal server error'
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

server.on('error', error => {
    console.error('Server startup error:', error.message);
    process.exitCode = 1;
});