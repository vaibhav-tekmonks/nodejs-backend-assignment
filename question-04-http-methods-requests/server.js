const http = require('http');
const handleRoutes = require('./routes/userRoutes');

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(
        `${req.method} ${req.url} | ` +
        `Content-Type: ${req.headers['content-type'] || 'not provided'} | ` +
        `Accept: ${req.headers.accept || 'not provided'}`
    );

    Promise.resolve()
    .then(() => handleRoutes(req, res))
    .catch(error => {
        console.error('Unhandled request error:', error);

        if (!res.headersSent && !res.destroyed) {
            res.writeHead(500, {
                'Content-Type': 'application/json; charset=utf-8'
            });

            res.end(JSON.stringify({
                success: false,
                error: 'Internal Server Error',
                message: 'An unexpected server error occurred'
            }));
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

server.on('error', error => {
    console.error('Server startup error:', error.message);
    process.exitCode = 1;
});