const http = require('http');
const handleUserRoutes = require('./routes/userRoutes');
const handleAuthRoutes = require('./routes/authRoutes');

const { sendJson } = require('./utils/httpUtils');

const server = http.createServer(async (req, res) => {
    console.log(
        `${req.method} ${req.url} | ` +
        `Content-Type: ${req.headers['content-type'] || 'not provided'} | ` +
        `Accept: ${req.headers.accept || 'not provided'}`
    );
    try {
        const url = new URL(
            req.url,
            `http://${req.headers.host || 'localhost'}`
        );
        const pathname = url.pathname;

        const authHandled = await handleAuthRoutes(req, res, pathname);
        if(authHandled) return;

        const useraHandled = handleUserRoutes(req, res, pathname);
        if(useraHandled) return;

        sendJson(res, 404, {
            success: true,
            error: "Route not found"
        });
    } catch (error) {
        console.error("Server error:", error.message);

        if(!res.headersSent && !res.destroyed) {
            sendJson(res, 400, {
                error: "Internal Server Error"
            });
        } else if (!res.destroy) {
            res.end();
        }
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http:localhost:${PORT}`);
});