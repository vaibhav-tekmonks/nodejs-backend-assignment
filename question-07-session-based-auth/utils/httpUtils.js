function sendJson(res, statusCode, data, headers = {}) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
        ...headers
    });
    res.end(JSON.stringify(data));
}

function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();

            // request-size limit -> 1 MB
            if (Buffer.byteLength(body) > 1024 * 1024) {
                const error = new Error("Request body too large");
                error.statusCode = 413;
                reject(error);
                req.destroy();
            }
        });
        req.on("end", () => {
            try{
                resolve(JSON.parse(body));
            } catch (error){
                const parseError = new Error("Invalid JSON body");
                parseError.statusCode = 400;
                reject(parseError);
            }
        });
        req.on("error", reject);
    });
}

module.exports = {
    sendJson,
    readJsonBody
}