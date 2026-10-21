const http = require('http');

const PORT = 3000;

const server = http.createServer( (req, res) => {
    res.setHeader("Content-Type", "application/json");

    if(req.method === 'GET' && req.url === '/') {
        res.writeHead(200);

        res.end(JSON.stringify({
            message: "Hello from a cluster worker!",
            processId: process.pid
        }));

        return;
    }
    if (req.method === "GET" && req.url === "/health") {
        res.writeHead(200);

        res.end(JSON.stringify({
            status: "OK",
            processId: process.pid
        }));

        return;
    }
    res.writeHead(404);
    res.end(JSON.stringify({
        error: "Route not found"
    }));
});

server.on("error", (error) => {
    console.error(
        `Worker ${process.pid} server error:`,
        error.message
    );

    process.exitCode = 1;
});

server.listen(PORT, () => {
    console.log(
        `Worker ${process.pid} listening on port ${PORT}`
    );
});