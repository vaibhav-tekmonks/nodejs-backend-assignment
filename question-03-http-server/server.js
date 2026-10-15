
const http = require('http');

const PORT = 3000;

const users = [
    { id: 1, name: 'Aman', email: 'aman@example.com' },
    { id: 2, name: 'Priya', email: 'priya@example.com' },
    { id: 3, name: 'Rahul', email: 'rahul@example.com' }
];

// send JSON responses
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8'
    });

    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    const method = req.method;
    const pathname = new URL(
        req.url,
        `http://${req.headers.host || 'localhost'}`
    ).pathname;

    // GET /
    if (method === 'GET' && pathname === '/') {
        return sendJSON(res, 200, {
            success: true,
            message: 'Welcome to the Node.js HTTP server'
        });
    }

    // GET /users
    if (method === 'GET' && pathname === '/users') {
        return sendJSON(res, 200, {
            success: true,
            count: users.length,
            data: users
        });
    }

    // GET /health
    if (method === 'GET' && pathname === '/health') {
        return sendJSON(res, 200, {
            success: true,
            status: 'OK',
            message: 'Server is running'
        });
    }

    // Known paths accessed using an unsupported method
    if (['/', '/users', '/health'].includes(pathname)) {
        res.setHeader('Allow', 'GET');

        return sendJSON(res, 405, {
            success: false,
            error: 'Method Not Allowed',
            message: 'Only GET requests are supported for this route'
        });
    }

    // Any other path
    return sendJSON(res, 404, {
        success: false,
        error: 'Not Found',
        message: `Route ${pathname} not found`
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// server startup errors handling
server.on('error', (err) => {
    console.error('Server error:', err.message);
    process.exitCode = 1;
});
