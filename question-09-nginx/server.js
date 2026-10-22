
const http = require("http");

const HOST = "127.0.0.1";
const PORT = 3000;

const server = http.createServer((req, res) => {
    // Handle API requests only.
    if (req.url === "/api/hello" && req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        return res.end(JSON.stringify({
            success: true,
            message: "Hello from Node.js API"
        }));
    }

    // Handle unknown routes.
    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        success: false,
        message: "API route not found"
    }));
});

server.listen(PORT, HOST, () => {
    console.log(`Node.js server running at http://${HOST}:${PORT}`);
});

server.on("error", (error) => {
    console.error("Server error:", error.message);
});
