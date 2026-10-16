function sendJSON(res, statusCode, data, extraHeaders = {}) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        ...extraHeaders
    });

    res.end(JSON.stringify(data));
}

module.exports = sendJSON;