const { createError } = require('./errorHandler');

function sendJson(res, statusCode, data, headers = {}) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
        ...headers
    });
    res.end(JSON.stringify(data));
}

function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        let settled = false;

        req.on("data", (chunk) => {
            if (settled) {
                return;
            }

            size += chunk.length;
            if (size > 1024 * 1024) {
                settled = true;
                chunks.length = 0;
                const error = createError("Request body too large", 413);
                reject(error);
                req.resume();
                return;
            }

            chunks.push(chunk);
        });
        req.on("end", () => {
            if (settled) {
                return;
            }

            try{
                settled = true;
                resolve(JSON.parse(Buffer.concat(chunks, size).toString("utf8")));
            } catch {
                settled = true;
                reject(createError("Invalid JSON body", 400));
            }
        });
        req.on("error", (error) => {
            if (!settled) {
                settled = true;
                reject(error);
            }
        });
    });
}

module.exports = {
    sendJson,
    readJsonBody
}